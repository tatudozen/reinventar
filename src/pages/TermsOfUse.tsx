import LegalLayout, { H2, P, UL } from '../components/LegalLayout';
import { LEGAL_INFO } from '../lib/legal-info';

const { controlador, documento, endereco, dominio, email, foro } = LEGAL_INFO;

export default function TermsOfUse() {
  return (
    <LegalLayout title="Termos de Uso">
      <P>
        Estes Termos de Uso (“Termos”) regulam o acesso e a utilização da <strong>Jornada Ikigai</strong> (“Plataforma”
        ou “Serviço”), disponível em {dominio} e operada por {controlador}, inscrita sob {documento}, com sede em
        {' '}{endereco}.
      </P>
      <P>
        Ao acessar ou utilizar a Jornada Ikigai, você declara que leu, compreendeu e concorda com estes Termos e com a
        nossa <strong>Política de Privacidade</strong>, que é parte integrante deste documento.
        <strong> Caso não concorde, não utilize a Plataforma.</strong>
      </P>

      <H2>1. O que é a Jornada Ikigai</H2>
      <P>
        A Jornada Ikigai é uma <strong>experiência gamificada de autoconhecimento e orientação vocacional</strong>. Por
        meio de missões interativas, você reflete sobre seus talentos, interesses, valores e causas. Ao final, recebe um
        resultado personalizado — a <strong>Mandala do Ikigai</strong> e <strong>caminhos de carreira e cursos
        sugeridos</strong> — gerado com apoio de inteligência artificial a partir das suas respostas.
      </P>
      <P>
        <strong>Natureza informativa.</strong> O conteúdo e o resultado da Jornada têm caráter <strong>educativo,
        reflexivo e informativo</strong>. Não constituem, e não substituem, orientação profissional, psicológica,
        pedagógica, médica ou de qualquer outra natureza especializada. Decisões de carreira, curso ou vida são de sua
        exclusiva responsabilidade.
      </P>

      <H2>2. Cadastro e informações fornecidas</H2>
      <P>
        Parte dos recursos — como <strong>salvar o resultado</strong> e <strong>receber o relatório</strong> — exige que
        você forneça informações de contato (nome, e-mail e, opcionalmente, telefone). Ao fornecer seus dados, você
        declara que:
      </P>
      <UL>
        <li>As informações são <strong>verdadeiras, exatas e atualizadas</strong>;</li>
        <li>Você é <strong>responsável</strong> pelas informações que insere na Plataforma;</li>
        <li>Você <strong>não utilizará dados de terceiros</strong> sem a devida autorização.</li>
      </UL>
      <P>O tratamento dos dados fornecidos segue a nossa <strong>Política de Privacidade</strong>.</P>

      <H2>3. Uso por adolescentes e menores de idade</H2>
      <P>
        A Jornada Ikigai pode ser utilizada por <strong>adolescentes</strong> em fase de escolha de curso ou carreira.
        Caso você seja menor de idade, o uso da Plataforma e o fornecimento de dados pessoais devem ocorrer com o
        <strong> consentimento e o acompanhamento de pelo menos um dos pais ou do responsável legal</strong>, nos termos
        da legislação aplicável. Pais e responsáveis são responsáveis por supervisionar o uso da Plataforma pelos menores
        sob sua guarda.
      </P>

      <H2>4. Regras de uso</H2>
      <P>Ao utilizar a Jornada Ikigai, você concorda em <strong>não</strong>:</P>
      <UL>
        <li>Utilizar a Plataforma para fins ilícitos, fraudulentos ou que violem direitos de terceiros;</li>
        <li>Inserir conteúdo ofensivo, discriminatório, difamatório ou ilegal nos campos de texto livre;</li>
        <li>Tentar acessar áreas restritas, contas administrativas ou dados de outros usuários;</li>
        <li>Realizar engenharia reversa, copiar, extrair em massa (scraping) ou explorar indevidamente a Plataforma, seus conteúdos ou sua base de dados;</li>
        <li>Introduzir vírus, malware ou qualquer código malicioso;</li>
        <li>Sobrecarregar, interromper ou prejudicar o funcionamento do Serviço.</li>
      </UL>
      <P>
        Podemos suspender ou encerrar o acesso de usuários que violem estes Termos, sem prejuízo das medidas legais
        cabíveis.
      </P>

      <H2>5. Programa de indicação (member-get-member)</H2>
      <P>
        A Jornada Ikigai pode oferecer um programa de <strong>indicação</strong>, no qual você compartilha um link
        pessoal e pode receber recompensas conforme regras específicas divulgadas na Plataforma. Reservamo-nos o direito
        de definir, alterar ou encerrar as regras e recompensas do programa, bem como de desqualificar indicações que
        envolvam fraude, cadastros falsos ou abuso.
      </P>

      <H2>6. Propriedade intelectual</H2>
      <P>
        Todo o conteúdo da Jornada Ikigai — incluindo marca, nome, logotipo, textos, narrativas das missões, layout,
        design, código, imagens e a metodologia da jornada — é de titularidade de {controlador} ou de seus licenciadores,
        e é protegido pela legislação de propriedade intelectual.
      </P>
      <P>
        É concedida a você uma licença <strong>limitada, pessoal, não exclusiva e intransferível</strong> para usar a
        Plataforma para fins próprios e não comerciais. É vedada a reprodução, distribuição ou exploração comercial sem
        autorização prévia e por escrito. O <strong>resultado individual</strong> gerado a partir das suas respostas é
        disponibilizado para o seu uso pessoal.
      </P>

      <H2>7. Serviços e conteúdos de terceiros</H2>
      <P>
        A Plataforma utiliza e pode conter links para serviços de terceiros (por exemplo, provedores de hospedagem,
        inteligência artificial, e-mail e mensageria). Não nos responsabilizamos pelo conteúdo, políticas ou práticas
        desses terceiros. O uso de tais serviços pode estar sujeito a termos e políticas próprios.
      </P>

      <H2>8. Disponibilidade e alterações do Serviço</H2>
      <P>
        Empregamos esforços para manter a Plataforma disponível e funcionando adequadamente, mas <strong>não
        garantimos</strong> operação ininterrupta ou livre de erros. Podemos, a qualquer tempo e a nosso critério,
        <strong> modificar, suspender ou descontinuar</strong> o Serviço (no todo ou em parte), bem como incluir, alterar
        ou remover funcionalidades e conteúdos.
      </P>

      <H2>9. Limitação de responsabilidade</H2>
      <P>Na máxima extensão permitida pela legislação aplicável:</P>
      <UL>
        <li>A Jornada Ikigai é fornecida <strong>“no estado em que se encontra”</strong> (“as is”);</li>
        <li>Não nos responsabilizamos por decisões tomadas com base no resultado ou nos conteúdos da Plataforma, que têm caráter informativo;</li>
        <li>Não nos responsabilizamos por danos indiretos, lucros cessantes, perda de dados ou indisponibilidades decorrentes de fatores fora do nosso controle razoável;</li>
        <li>Não garantimos que os caminhos de carreira ou cursos sugeridos sejam adequados a todos os perfis, contextos ou objetivos individuais.</li>
      </UL>

      <H2>10. Alterações destes Termos</H2>
      <P>
        Podemos atualizar estes Termos periodicamente para refletir melhorias no Serviço ou mudanças legais. A versão
        vigente estará sempre disponível nesta página, com a data da última atualização. O uso continuado da Plataforma
        após a publicação de alterações significa a sua concordância com os Termos revisados.
      </P>

      <H2>11. Lei aplicável e foro</H2>
      <P>
        Estes Termos são regidos pelas leis da <strong>República Federativa do Brasil</strong>. Fica eleito o foro da
        comarca de {foro} para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia a qualquer outro,
        por mais privilegiado que seja, ressalvado o direito do consumidor de optar pelo foro de seu domicílio.
      </P>

      <H2>12. Contato</H2>
      <P>
        Dúvidas, solicitações ou comunicações sobre estes Termos podem ser enviadas para {email}.
      </P>
    </LegalLayout>
  );
}
