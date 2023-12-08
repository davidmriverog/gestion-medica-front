import { Injectable } from "@angular/core"
import { PermissionValues } from "../core/enums/sys/permission-values.enum"
import { RoleEnum } from "../core/enums/sys/rol-values.enum"

import { Navigation } from "../exports/lib"

const navigationItems: Array<Navigation> = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: "feather icon-home",
    url: "/home/dashboard-recepcionist",
    breadcrumbs: false,
    roles: [
      PermissionValues.DASHBOARD_RECEPTIONIST
    ]
  },
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: "feather icon-home",
    url: "/home/dashboard",
    breadcrumbs: false,
    roles: [
      PermissionValues.DASHBOARD_ADMIN
    ]
  },
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: "feather icon-home",
    url: "/home/dashboard-doctor",
    breadcrumbs: false,
    roles: [
      PermissionValues.DASHBOARD_DOCTOR
    ]
  },
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: "feather icon-home",
    url: "/home/dashboard-client",
    breadcrumbs: false,
    roles: [
      RoleEnum.Patient
    ]
  },
  {
    id: "client-data",
    title: "Mi perfil",
    type: "item",
    icon: "fas fa-user",
    url: "/profile/profile-patient",
    breadcrumbs: false,
    roles: [
      RoleEnum.Patient
    ]
  },
  {
    id: "client-data",
    title: "Mis Comprobantes",
    type: "item",
    icon: "fa fa-file-invoice-dollar",
    url: "/client/reservations",
    breadcrumbs: false,
    roles: [
      RoleEnum.Patient
    ]
  },
  {
    id: "clinic-menu",
    title: "Clínica",
    type: "collapse",
    icon: "fas fa-hospital",
    roles: [
      PermissionValues.MOD_CLINICA
    ],
    children: [
      {
        id: "clinic-menu-21.1",
        title: "Diagnósticos (CIE-10)",
        type: "item",
        url: "/clinic/diagnostics",
        hidden: false,
        roles: [
          PermissionValues.GESTION_DIAGNOSTICO
        ]
      },
      {
        id: "clinic-menu-2.1",
        title: "Consultorios",
        type: "item",
        url: "/clinic/medical-offices",
        hidden: false,
        roles: [
          PermissionValues.GESTION_CONSULTORIO
        ]
      },
      {
        id: "menu-level-2.4",
        title: "Médicos",
        type: "item",
        url: "/clinic/doctors",
        hidden: false,
        roles: [
          PermissionValues.GESTION_MEDICOS
        ]
      },
      {
        id: "clinic-menu-2.2",
        title: "Pacientes",
        type: "item",
        url: "/clinic/patients",
        hidden: false,
        roles: [
          PermissionValues.GESTION_PACIENTES
        ]
      },
      {
        id: "clinic-menu-2.3",
        title: "Especialidades",
        type: "item",
        url: "/clinic/specialities",
        hidden: false,
        roles: [
          PermissionValues.GESTION_ESPECIALIDADES
        ]
      },
      {
        id: "clinic-menu-2.4",
        title: "Medicamentos",
        type: "item",
        url: "/clinic/medicines",
        hidden: false,
        roles: [
          PermissionValues.ABM_MEDICAMENTOS
        ]
      },
    ]
  },
  {
    id: "menu-level",
    title: "Configuraciones",
    type: "collapse",
    icon: "feather icon-menu",
    roles: [
      PermissionValues.MOD_CONFIGURACIONES
    ],
    children: [
      {
        id: "menu-level-2.1",
        title: "Información de la empresa",
        type: "item",
        url: "/conf/client-info",
        hidden: false,
        breadcrumbs: false,
        roles: [
          PermissionValues.GESTION_CONF_CLIENTE
        ]
      },
      {
        id: "menu-level-2.2",
        title: "Tipo de documento",
        type: "item",
        url: "/conf/document-types",
        hidden: false,
        roles: [
          PermissionValues.GESTION_CONF_CLIENTE
        ]
      }
    ]
  },
  {
    id: "menu-level",
    title: "Programación",
    type: "collapse",
    icon: "fa fa-calendar",
    roles: [
      PermissionValues.MOD_PROG_MEDICO
    ],
    children: [
      {
        id: "menu-level-2.2",
        title: "Programación Med.",
        type: "item",
        url: "/prog/programming",
        hidden: false,
        roles: [
          PermissionValues.GESTION_PROG_MEDIC
        ]
      },
    ]
  },
  {
    id: "menu-level",
    title: "Facturación",
    type: "collapse",
    icon: "fa fa-file-invoice",
    roles: [
      PermissionValues.MOD_VENTAS
    ],
    children: [
      {
        id: "menu-level-3.1",
        title: "Nueva reserva",
        type: "item",
        url: "/ms/sale-create",
        hidden: false,
        roles: [
          PermissionValues.FORM_VENTA
        ]
      },
      {
        id: "menu-level-3.2",
        title: "Historial reservaciones",
        type: "item",
        url: "/ms/sales",
        hidden: false,
        roles: [
          PermissionValues.HISTORIAL_VENTAS
        ]
      }
    ]
  },
  {
    id: "menu-level",
    title: "Finanzas",
    type: "collapse",
    icon: "fa fa-hand-holding-usd",
    roles: [
      PermissionValues.MOD_FINANZAS
    ],
    children: [
      {
        id: "menu-level-10.1",
        title: "Período Contable",
        type: "item",
        url: "/ac/accounting-periods",
        hidden: false,
        roles: [
          PermissionValues.GESTION_PERIDOS_CONT
        ]
      },
      {
        id: "menu-level-10.2",
        title: "Movimientos",
        type: "item",
        url: "/ac/movements",
        hidden: false,
        roles: [
          PermissionValues.GESTION_MOV_CONTABLES
        ]
      },
      {
        id: "menu-level-10.2",
        title: "Moneda",
        type: "item",
        url: "/ac/currencies",
        hidden: false,
        roles: [
          PermissionValues.GESTION_MONEDAS
        ]
      },

    ]
  },
  {
    id: "menu-level",
    title: "Productos",
    type: "collapse",
    icon: "fa fa-shopping-cart",
    roles: [
      PermissionValues.MOD_PRODUCTOS
    ],
    children: [
      {
        id: "menu-level-10.1",
        title: "Productos",
        type: "item",
        url: "/ar/products",
        hidden: false,
        roles: [
          PermissionValues.GESTION_PRODUCTOS
        ]
      },
      {
        id: "menu-level-10.1",
        title: "Tipos de productos",
        type: "item",
        url: "/ar/product-categories",
        hidden: false,
        roles: [
          PermissionValues.GESTION_TIPO_PRODUCTOS
        ]
      },
      {
        id: "menu-level-10.2",
        title: "Condición de pago",
        type: "item",
        url: "/ar/payment-conditions",
        hidden: false,
        roles: [
          PermissionValues.GESTION_COND_PAGOS
        ]
      }
    ]
  },
  {
    id: "menu-level",
    title: "Agenda",
    type: "collapse",
    icon: "feather icon-user",
    roles: [
      PermissionValues.MOD_RRHH
    ],
    children: [
      {
        id: "menu-level-3.5",
        title: "Personal",
        type: "item",
        url: "/sys/staffs",
        hidden: false,
        roles: [
          PermissionValues.GESTION_EMPLEADOS
        ]
      },
    ]
  },
  {
    id: "menu-level",
    title: "Seguridad",
    type: "collapse",
    icon: "feather icon-lock",
    roles: [
      PermissionValues.MOD_SEGURIDAD
    ],
    children: [
      {
        id: "menu-level-3.1",
        title: "Usuarios",
        type: "item",
        url: "/sys/users",
        hidden: false,
        roles: [
          PermissionValues.GESTION_USUARIOS
        ]
      },
      {
        id: "menu-level-3.2",
        title: "Roles",
        type: "item",
        url: "/sys/roles",
        hidden: false,
        roles: [
          PermissionValues.GESTION_ROLES
        ]
      },
      {
        id: "menu-level-3.3",
        title: "Permisos",
        type: "item",
        url: "/sys/permissions",
        hidden: false,
        roles: [
          PermissionValues.GESTION_PERMISOS
        ]
      },
      {
        id: "menu-level-3.4",
        title: "Recursos",
        type: "item",
        url: "/sys/resources",
        hidden: false,
        roles: [
          PermissionValues.GESTION_RECURSOS
        ]
      }
    ]
  },
  {
    id: "menu-level",
    title: "Gestión citas",
    type: "collapse",
    icon: "fa fa-ticket-alt",
    roles: [
      RoleEnum.Medical
    ],
    children: [
      {
        id: "menu-level-3.2",
        title: "Historial de atenciones",
        type: "item",
        url: "/act/attention-history-lists",
        hidden: false,
        roles: [
          RoleEnum.Medical
        ]
      },
    ]
  },
]

@Injectable({
  providedIn: "root"
})
export class NavigationItem {
  public get() {
    return navigationItems
  }
}
