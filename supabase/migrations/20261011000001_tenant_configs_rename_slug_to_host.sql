-- Renomeia a coluna `slug` para `host` na tabela tenant_configs.
-- O campo identifica o hostname do tenant (ex: jornada.parceiro.com.br),
-- então `host` é mais semântico e alinhado com o que a API e o frontend esperam.

alter table reinventar.tenant_configs
  rename column slug to host;
