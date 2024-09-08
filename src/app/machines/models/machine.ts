export type Machine = {
    id: number,
    name: string,
    status: 'ON' | 'OFF',
    history: MachineHistory[]
}

export type MachineHistory = {
    status: 'ON' | 'OFF',
    time: Date
}