export interface BautizoBase {
    fecha_bautizo: string;
    lugar_bautizo: string;
    iglesia_bautizo: string | null;
    miembro_id: number;
}

export interface BautizoCreate extends BautizoBase { }

export interface BautizoResponse extends BautizoBase {
    miembro: {
        nombres: string;
        apellidos: string;
    }
}
