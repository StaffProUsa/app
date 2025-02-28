type Cliente = {
    descripcion: string;
    estado: number;
    key_company: string;
    contacto: string;
    key_usuario: string;
    nivel_ingles: string | null;
    fecha_on: string;
    latitude: number | null;
    direccion: string;
    index: number | null;
    papeles: string;
    telefono: string;
    key: string;
    observacion: string;
    longitude: number | null;
};

type Evento = {
    descripcion: string;
    fecha: string;
    estado: number;
    key_company: string;
    key_usuario: string;
    fecha_on: string;
    estado_venta: number;
    key_cliente: string;
    key: string;
    observacion: string;
};

type Staff = {
    descripcion: string;
    estado: number;
    key_usuario: string;
    fecha_inicio: string;
    nivel_ingles: string;
    key_staff_tipo: string;
    fecha_on: string;
    fecha_fin: string;
    cantidad: number;
    key_evento: string;
    key: string;
    observacion: string | null;
};

type Company = {
    descripcion: string;
    estado: number;
    contacto: string;
    key_usuario: string;
    fecha_on: string;
    latitude: number | null;
    direccion: string;
    telefono: string;
    key: string;
    observacion: string;
    email: string;
    longitude: number | null;
};

type StaffTipo = {
    descripcion: string;
    estado: number;
    key_usuario: string;
    color: string | null;
    fecha_on: string;
    key: string;
    observacion: string | null;
};

type StaffUsuario = {
    descripcion_rechazo: string | null;
    estado: number;
    fecha_aprobacion: string;
    fecha_aprobacion_invitacion: string | null;
    fecha_atiende: string | null;
    fecha_ingreso: string | null;
    fecha_on: string;
    fecha_rechazo: string | null;
    fecha_salida: string | null;
    key: string;
    key_asistencia_ingreso: string | null;
    key_asistencia_salida: string | null;
    key_staff: string;
    key_usuario: string;
    key_usuario_aprueba: string;
    key_usuario_asigna_atiende: string | null;
    key_usuario_atiende: string | null;
}




export type ObjectStaffUsuario = {
    cliente: Cliente;
    evento: Evento;
    staff: Staff;
    company: Company;
    staff_tipo: StaffTipo;
    staff_usuario: StaffUsuario;
};

export type ObjectStaffBoss = {
    cliente: Cliente;
    evento: Evento;
    staff: Staff;
    company: Company;
    staff_tipo: StaffTipo;
};


export type EventListener = {
    type: "onChange",
    data: Evento,
} | {
    type: "onRecibeInvitation",
}
