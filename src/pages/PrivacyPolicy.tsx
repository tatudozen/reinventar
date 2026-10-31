import LegalLayout, { H2, H3, P, UL, Note } from '../components/LegalLayout';
import { LEGAL_INFO } from '../lib/legal-info';

const { controlador, documento, endereco, dominio, email } = LEGAL_INFO;

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidade">
      <P>
        Nós, responsáveis pela <strong>Jornada Ikigai</strong> (operada por {controlador}, inscrita sob {documento},
        com sede em {endereco}), estamos comprometidos em resguardar sua privacidade e proteger seus dados pessoais. O
        intuito deste documento é esclarecer quais informações são coletadas dos usuários da Jornada Ikigai — disponível
        em {dominio} — e de que forma esses dados são utilizados.
      </P>
      <P>
        A Jornada Ikigai é uma experiência gamificada de autoconhecimento e orientação vocacional: por meio de missões,
        você reflete sobre seus talentos, interesses, valores e causas, e ao final recebe um resultado personalizado
        (Mandala do Ikigai e caminhos de carreira/cursos sugeridos), gerado com apoio de inteligência artificial.
      </P>
      <P>
        Reconhecemos que a sua privacidade é muito importante e tomamos todas as medidas possíveis para protegê-la. Esta
        Política de Privacidade (“Política”) informa como as suas informações e dados pessoais são coletados, usados,
        compartilhados e armazenados. Este documento é parte integrante dos nossos <strong>Termos de Uso</strong>.
      </P>
      <P>
        A aceitação desta Política ocorre quando você, de forma afirmativa, fornece seus dados para salvar o resultado da
        Jornada e/ou responder à pesquisa de satisfação, concordando com o uso dos seus dados para as finalidades aqui
        descritas. Se você não concordar com esta Política, por favor não conclua o cadastro nem utilize os nossos
        serviços. Ainda assim, pedimos que nos comunique a sua discordância pelo e-mail {email}, para que possamos
        esclarecer ou melhorar este documento.
      </P>

      <H2>1. Quais são as fontes de dados pessoais?</H2>
      <P>
        A quantidade e o tipo de informações coletadas variam conforme o uso que você faz da Jornada Ikigai. Esta
        Política se aplica aos dados pessoais que coletamos de ou sobre você por meio das seguintes fontes:
      </P>
      <UL>
        <li><strong>Site e aplicação da Jornada Ikigai.</strong> Páginas que operamos sob nosso domínio {dominio}, incluindo as missões, o cadastro para salvar o resultado e a pesquisa de satisfação.</li>
        <li><strong>Interações com nossos conteúdos.</strong> Registros de suas interações com a jornada, e-mails e mensagens que enviamos (por exemplo, se você abre ou clica em um link do Plano de Reinvenção enviado).</li>
        <li><strong>Dados criados por nós.</strong> Durante o seu uso, criamos dados sobre você — como o resultado analisado a partir das suas respostas (Mandala do Ikigai, perfil vocacional e caminhos sugeridos).</li>
        <li><strong>Indicações (member-get-member).</strong> Quando você chega à Jornada por um link de indicação de outra pessoa, registramos essa relação (quem indicou quem) para viabilizar recompensas de indicação, quando aplicável.</li>
      </UL>

      <H3>1.1. Quais são as bases legais para a coleta dos dados?</H3>
      <P>
        Utilizamos como base legal apenas hipóteses autorizadas pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018 —
        LGPD), incluindo, mas não se limitando a: <strong>consentimento</strong>, <strong>legítimo interesse</strong> e
        <strong> execução de contrato/procedimentos preliminares</strong>. Quando a base legal não for o consentimento,
        sempre observaremos a legislação vigente e respeitaremos os seus direitos e liberdades individuais.
      </P>

      <H2>2. Que tipos de dados a Jornada Ikigai coleta?</H2>

      <H3>2.1. Visitantes da aplicação</H3>
      <P>
        Caso você apenas navegue pela Jornada Ikigai, podemos coletar <strong>dados de navegação</strong> e utilizar
        cookies e tecnologias semelhantes. “Cookies” são identificadores que transferimos para o seu navegador ou
        dispositivo, que nos permitem reconhecê-lo e entender como e quando as páginas e recursos são visitados. Podemos
        utilizar:
      </P>
      <UL>
        <li><strong>Cookies estritamente necessários</strong>, para o funcionamento básico da aplicação (por exemplo, manter o andamento da sua jornada no seu navegador);</li>
        <li><strong>Cookies/serviços de análise</strong> (por exemplo, para medir acessos e melhorar a experiência).</li>
      </UL>
      <P>
        Você pode limitar, recusar ou desabilitar cookies nas configurações do seu navegador. Contudo, ao fazer isso,
        algumas áreas da aplicação podem não funcionar corretamente. Esta Política não cobre o uso de cookies por
        terceiros, e não somos responsáveis pelas políticas e práticas de privacidade deles.
      </P>
      <Note>
        Utilizamos parte das informações da sua jornada localmente no seu próprio navegador (armazenamento local) para
        permitir que você retome o resultado sem precisar refazer o cadastro.
      </Note>

      <H3>2.2. Usuários que salvam o resultado</H3>
      <P>Ao concluir a jornada e optar por <strong>salvar o seu resultado</strong>, coletamos:</P>
      <UL>
        <li><strong>Dados de contato:</strong> nome, e-mail e telefone (o telefone é opcional);</li>
        <li><strong>Respostas das missões:</strong> as escolhas e reflexões que você registra ao longo das 8 missões (interesses, talentos, valores, causas, arquétipos e projeções de futuro). Esses dados podem incluir informações sobre suas preferências e aspirações;</li>
        <li><strong>Dados da jornada:</strong> mentor escolhido, tema visual, pontos de experiência (XP) e missões concluídas;</li>
        <li><strong>Resultado gerado:</strong> perfil vocacional, Mandala do Ikigai e caminhos de carreira/cursos sugeridos, produzidos a partir da análise das suas respostas.</li>
      </UL>
      <P>
        Esses dados são utilizados para <strong>gerar e entregar o seu resultado personalizado</strong>, para permitir
        que você o acesse novamente e, quando você fornecer e-mail e/ou telefone, para <strong>enviar o Plano de Reinvenção</strong>
        correspondente por e-mail e/ou WhatsApp.
      </P>

      <H3>2.3. Pesquisa de satisfação (opcional)</H3>
      <P>
        Se você optar por responder à pesquisa ao final da jornada, coletamos suas respostas, que podem incluir: perfil
        de quem respondeu, recomendação (NPS de 0 a 10), percepção de clareza e de precisão do resultado, missão
        favorita, percepção sobre o tamanho da jornada, pontos de dificuldade, sugestões abertas, interesse em participar
        de comunidade sobre inteligência artificial e eventuais cursos em dúvida. Esses dados nos ajudam a
        <strong> melhorar a Jornada Ikigai</strong> e, quando você indica cursos em dúvida, a
        <strong> direcionar conteúdos e apoio</strong> à sua decisão.
      </P>

      <H2>3. Com quem a Jornada Ikigai compartilha os seus dados?</H2>
      <P>
        <strong>Nós não vendemos nem alugamos os seus dados pessoais.</strong> Podemos compartilhá-los, de forma limitada
        e para as finalidades desta Política, com:
      </P>
      <UL>
        <li><strong>Provedores de infraestrutura e armazenamento.</strong> Utilizamos serviços de hospedagem e banco de dados para operar a aplicação e armazenar os dados da jornada. Estes provedores atuam como <strong>operadores</strong>, tratando os dados apenas conforme nossas instruções.</li>
        <li><strong>Provedores de inteligência artificial.</strong> As respostas da sua jornada são processadas por serviços de IA (por exemplo, o Google Gemini) para gerar a análise e o resultado personalizado. O compartilhamento se limita ao necessário para essa finalidade.</li>
        <li><strong>Provedores de mensageria e e-mail.</strong> Para enviar o seu Plano de Reinvenção, podemos utilizar serviços de automação, e-mail e envio de mensagens (por exemplo, via WhatsApp), com os dados de contato que você fornecer.</li>
        <li><strong>Ferramentas de análise (analytics).</strong> Dados podem ser utilizados de forma agregada e, sempre que possível, anonimizada, para compreender o uso da plataforma e melhorar os serviços — sem a finalidade de identificar você individualmente.</li>
        <li><strong>Autoridades e proteção de direitos.</strong> Podemos acessar, preservar e divulgar dados quando acreditarmos, de boa-fé, que isso é necessário para cumprir obrigação legal ou ordem judicial, ou para proteger direitos, propriedade ou segurança da Jornada Ikigai e de terceiros.</li>
      </UL>
      <P>
        Todos os nossos parceiros são autorizados a utilizar os dados apenas para os fins específicos para os quais foram
        contratados.
      </P>

      <H2>4. Dados de crianças e adolescentes</H2>
      <P>
        A Jornada Ikigai pode ser utilizada por <strong>adolescentes</strong> em fase de escolha de curso ou carreira,
        inclusive junto de seus pais ou responsáveis.
      </P>
      <P>
        O tratamento de dados pessoais de <strong>crianças e adolescentes</strong> é realizado em seu
        <strong> melhor interesse</strong>, nos termos do art. 14 da LGPD. Quando o titular for menor de idade, a coleta
        e o tratamento de dados dependem do <strong>consentimento específico e destacado de pelo menos um dos pais ou do
        responsável legal</strong>, salvo nas hipóteses legalmente autorizadas.
      </P>
      <P>
        Se você é pai, mãe ou responsável e identificar que um menor sob sua responsabilidade forneceu dados sem o seu
        consentimento, entre em contato pelo e-mail {email} para que possamos revisar, restringir ou excluir tais dados.
      </P>

      <H2>5. Quais são os direitos dos titulares de dados?</H2>
      <P>
        Você sempre poderá optar por não divulgar seus dados, mas tenha em mente que alguns deles são necessários para
        salvar o resultado ou receber o Plano de Reinvenção. Independentemente disso, você possui direitos relativos à privacidade
        e à proteção dos seus dados pessoais. Sob a <strong>LGPD</strong> (e, quando aplicável, a GDPR), você tem os
        seguintes direitos:
      </P>
      <UL>
        <li>Confirmação da existência de tratamento;</li>
        <li>Acesso aos dados;</li>
        <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
        <li>Portabilidade dos dados;</li>
        <li>Eliminação dos dados tratados com base no consentimento;</li>
        <li>Informação sobre com quem compartilhamos seus dados;</li>
        <li>Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;</li>
        <li>Revogação do consentimento, a qualquer momento;</li>
        <li>Revisão de decisões tomadas unicamente com base em tratamento automatizado;</li>
        <li>Oposição a tratamento realizado com fundamento em uma das hipóteses de dispensa de consentimento, em caso de descumprimento da lei.</li>
      </UL>
      <P>
        <strong>Como exercer:</strong> basta enviar um e-mail para {email}. Poderemos solicitar informações específicas
        para confirmar a sua identidade e garantir que os dados não sejam divulgados a quem não tenha direito de
        recebê-los. Suas solicitações legítimas serão atendidas dentro dos prazos previstos na legislação; caso a
        solicitação seja particularmente complexa, iremos notificá-lo e mantê-lo atualizado sobre o andamento.
      </P>
      <Note>
        <strong>Sobre decisões automatizadas:</strong> o resultado da Jornada (perfil e caminhos sugeridos) é gerado com
        apoio de análise automatizada e de inteligência artificial e tem caráter <strong>informativo e de
        autoconhecimento</strong> — não substitui orientação profissional, psicológica ou educacional. Você pode
        solicitar esclarecimentos sobre a lógica envolvida.
      </Note>

      <H2>6. Por quanto tempo os dados serão armazenados?</H2>
      <P>
        Manteremos seus dados pessoais somente pelo tempo necessário para cumprir as finalidades para as quais foram
        coletados, inclusive para o cumprimento de obrigações legais ou requisição de autoridades competentes.
      </P>
      <P>
        Para determinar o período de retenção, consideramos a quantidade, a natureza e a sensibilidade dos dados, o risco
        potencial de uso indevido, a finalidade do tratamento e os requisitos legais aplicáveis.
      </P>
      <P>
        Caso você solicite a <strong>exclusão</strong> dos seus dados, estes serão removidos dos nossos sistemas ativos,
        ressalvadas as hipóteses em que a manutenção seja necessária por obrigação legal ou para o exercício regular de
        direitos.
      </P>

      <H2>7. Como funciona a Segurança da Informação?</H2>
      <P>
        Adotamos boas práticas de segurança da informação para proteger os dados que mantemos, incluindo controle de
        acesso, transmissão por conexões seguras (HTTPS) e restrição de acesso administrativo por autenticação.
      </P>
      <P>
        Apesar dos nossos esforços, nenhum sistema é totalmente imune a falhas. Acesso não autorizado, falhas de hardware
        ou software e outros fatores podem, eventualmente, comprometer a segurança dos dados. Por isso, ajude-nos a
        manter um ambiente seguro: caso identifique algo que comprometa a segurança dos seus dados, entre em contato pelo
        e-mail {email}.
      </P>

      <H2>8. Mudanças na Política de Privacidade</H2>
      <P>
        Como estamos sempre buscando melhorar nossos serviços, esta Política pode ser atualizada. Recomendamos visitar
        esta página periodicamente. Caso sejam feitas alterações relevantes que exijam um novo consentimento,
        publicaremos a atualização e solicitaremos o seu consentimento novamente.
      </P>
      <P><strong>Dúvidas?</strong> Fale com a gente pelo e-mail {email}.</P>
    </LegalLayout>
  );
}
