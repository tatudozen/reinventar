
import React, { useState, useRef } from 'react';
import { useGame } from '../store/GameContext';
import { storage, db } from '../firebase-config';
// @ts-ignore - Firebase v9 types workaround
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// @ts-ignore
import { doc, setDoc } from 'firebase/firestore';
import { Mic, Square, Loader2, CheckCircle, Play, Pause, RefreshCw, AlertCircle, XCircle } from 'lucide-react';

export const AuditScreen: React.FC = () => {
  const { goToScreen, userUid, isOffline, resetProgress } = useGame();
  
  // Estados da Interface
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'uploading_file' | 'saving_db' | 'completed'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Referências para lógica de gravação
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mimeTypeRef = useRef<string>('audio/webm');
  const recordedBlobRef = useRef<Blob | null>(null); // Armazena o blob para reenvio

  const startRecording = async () => {
    setErrorMessage(null);
    if (isOffline) {
      setErrorMessage("Você precisa estar online para enviar a auditoria.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
         mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
         mimeType = 'audio/mp4';
      }
      mimeTypeRef.current = mimeType;

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;

      // Importante: Gravar em chunks de 1s para garantir dados
      mediaRecorder.start(1000);
      setStatus('recording');
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      setErrorMessage("Erro ao acessar microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordingStop = async () => {
    setStatus('processing');
    
    // Pequeno delay para garantir que o último chunk foi processado
    setTimeout(async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
        
        if (audioBlob.size === 0) {
            setErrorMessage("Gravação vazia. Por favor, tente novamente.");
            setStatus('idle');
            return;
        }
        
        recordedBlobRef.current = audioBlob;
        await uploadToFirebase(audioBlob);
    }, 500);
  };

  const retryUpload = () => {
      if (recordedBlobRef.current) {
          uploadToFirebase(recordedBlobRef.current);
      } else {
          setErrorMessage("Áudio perdido. Grave novamente.");
          setStatus('idle');
      }
  };

  const uploadToFirebase = async (blob: Blob) => {
    if (!userUid || !storage) {
        setErrorMessage("Erro de configuração ou usuário desconectado.");
        setStatus('idle');
        return;
    }

    setStatus('uploading_file');
    setErrorMessage(null);

    try {
        const extension = mimeTypeRef.current.includes('mp4') ? 'mp4' : 'webm';
        const timestamp = Date.now();
        const filename = `audits/${userUid}/${timestamp}.${extension}`;
        const storageRef = ref(storage, filename);

        console.log(`Iniciando upload simples (${blob.size} bytes) para: ${filename}`);

        const metadata = {
          contentType: mimeTypeRef.current
        };

        // 1. Cria a Promise do Upload
        const uploadPromise = uploadBytes(storageRef, blob, metadata);

        // 2. Cria a Promise de Timeout (30 segundos)
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Timeout: O envio demorou muito."));
            }, 30000); // 30 segundos
        });

        // 3. Corrida: Quem terminar primeiro ganha
        // Se o timeout ganhar, ele joga o erro e cai no catch
        await Promise.race([uploadPromise, timeoutPromise]);
        
        console.log("Upload concluído. Obtendo URL...");
        const downloadURL = await getDownloadURL(storageRef);
        console.log("URL obtida:", downloadURL);
        
        setStatus('saving_db');
        setAudioUrl(downloadURL);

        if (db) {
            const userRef = doc(db, "users", userUid);
            await setDoc(userRef, {
                auditAudioUrl: downloadURL,
                auditCompletedAt: new Date().toISOString()
            }, { merge: true });
        }

        setStatus('completed');

    } catch (error: any) {
        // Se o status já for idle (cancelado manualmente), ignorar erro
        if (status === 'idle') return;

        console.error("Erro no processo de upload:", error);
        
        let msg = "Falha ao enviar o áudio.";
        if (error.message && error.message.includes("Timeout")) {
            msg = "O envio demorou muito (Timeout). Tente novamente.";
        } else if (error.code === 'storage/unauthorized') {
            msg = "Permissão negada (Verifique Regras do Storage).";
        } else if (error.code === 'storage/retry-limit-exceeded') {
            msg = "Conexão instável. Tente novamente.";
        } else if (error.message && error.message.includes('network')) {
            msg = "Erro de rede (Possível bloqueio de CORS).";
        }
        
        setErrorMessage(msg);
        setStatus('idle');
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }

    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const resetAudit = () => {
    // Cancela o player de áudio se estiver tocando
    if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
    }
    
    // Limpa estados
    setAudioUrl(null);
    setStatus('idle');
    setIsPlaying(false);
    setErrorMessage(null);
    audioChunksRef.current = [];
    recordedBlobRef.current = null;
  };

  const finishJourney = () => {
    resetProgress(true); // Reseta automaticamente sem perguntar ao concluir
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-gray-900 z-0"></div>

      <div className="z-10 w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Auditoria do Passado</h2>
        <p className="text-gray-400 mb-10 text-sm uppercase tracking-widest">Grave sua reflexão final</p>

        {errorMessage && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 p-4 rounded-lg text-left animate-pulse">
                <div className="flex items-center gap-3 text-red-200 text-sm font-bold mb-2">
                    <AlertCircle size={20} className="shrink-0" />
                    <p>{errorMessage}</p>
                </div>
                {recordedBlobRef.current && (
                    <button 
                        onClick={retryUpload}
                        className="w-full py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        Tentar Enviar Novamente
                    </button>
                )}
            </div>
        )}

        {status === 'idle' && !errorMessage && (
           <div className="animate-fade-in-up">
              <button
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-900/50 transition-all hover:scale-105 group mx-auto mb-6"
              >
                <Mic className="w-10 h-10 text-white group-hover:animate-pulse" />
              </button>
              <p className="text-gray-300 font-light">
                Toque no microfone para começar a gravar.<br/>
                <span className="text-xs text-gray-500 mt-2 block">Fale sobre o que você descobriu nesta jornada.</span>
              </p>
           </div>
        )}

        {status === 'recording' && (
            <div className="flex flex-col items-center">
                <div className="relative mb-8">
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                    <div className="relative w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center border-4 border-red-500">
                        <div className="w-20 h-1 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="text-red-400 font-mono text-lg mb-8 animate-pulse">GRAVANDO...</p>
                <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-bold transition-colors border border-gray-600"
                >
                    <Square className="w-4 h-4 fill-current" /> PARAR
                </button>
            </div>
        )}

        {(status === 'processing' || status === 'uploading_file' || status === 'saving_db') && (
            <div className="flex flex-col items-center w-full max-w-xs mx-auto">
                <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 text-brand-blue animate-spin" />
                </div>
                
                <p className="text-gray-300 text-lg mb-2">
                    {status === 'processing' && 'Processando áudio...'}
                    {status === 'uploading_file' && 'Enviando para a nuvem...'}
                    {status === 'saving_db' && 'Finalizando...'}
                </p>
                
                {status === 'uploading_file' && (
                  <button 
                    onClick={() => {
                      setStatus('idle');
                      setErrorMessage("Envio cancelado manualmente.");
                    }}
                    className="mt-4 flex items-center gap-2 text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1 rounded-full transition-colors"
                  >
                    <XCircle size={14} /> Cancelar envio
                  </button>
                )}
                
                <p className="text-xs text-gray-500 mt-4">Não feche o aplicativo</p>
            </div>
        )}

        {status === 'completed' && (
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 animate-scale-in">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Auditoria Salva!</h3>
                <p className="text-gray-400 mb-6 text-sm">Sua voz foi registrada com sucesso.</p>

                <div className="flex gap-3 justify-center mb-6">
                    <button 
                        onClick={togglePlayback}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                        {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
                        {isPlaying ? "Pausar" : "Ouvir"}
                    </button>
                    <button 
                        onClick={resetAudit}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm text-gray-400 hover:text-white"
                    >
                        <RefreshCw size={16}/> Regravar
                    </button>
                </div>

                <button
                    onClick={finishJourney}
                    className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors tracking-wide"
                >
                    CONCLUIR JORNADA
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
