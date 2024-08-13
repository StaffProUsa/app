export type UsuarioType = {
    id: string, name: string, last_name: string, email: string
}

export type LoginType = {
    onLogin: (data: UsuarioType) => any,
}