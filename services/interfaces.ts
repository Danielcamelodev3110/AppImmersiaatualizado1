export type TipoUsuario = "cliente" | "administrador" | "anfitriao";
export type StatusConta = "ativo" | "inativo" | "bloqueado" | "pendente";

export interface User {
  id: number;
  nome_completo: string;
  email: string;
  cpf?: string;
  tipo_usuario: TipoUsuario;
  status_conta: StatusConta;
  data_nascimento?: string;
  telefone?: string;
  avatar_url?: string;
  bio?: string;
  data_criacao: string;
  data_atualizacao: string;
}

export interface CreateUserDto extends Partial<
  Omit<User, "id" | "data_criacao" | "data_atualizacao">
> {
  nome_completo: string;
  email: string;
  senha?: string; // Senha em texto puro para o cadastro/login
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
