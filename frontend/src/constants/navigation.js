export const HOME_BY_ROLE = {
  Admin: '/app/admin',
  Gerente: '/app/gerente',
  Usuario: '/app/cajero',
}

export const NAVIGATION = [
  { label: 'Catálogo',          path: '/app/albums', roles: ['Admin', 'Gerente', 'Usuario'] },
  { label: 'Usuarios',          path: '/app/users',  roles: ['Admin', 'Gerente'] },
  { label: 'Reporte de Ventas', path: '/app/sales',  roles: ['Admin'] },
]
