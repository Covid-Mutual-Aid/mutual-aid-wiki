import { getSheetData, groupConstructor } from '../adapters'
import { createSource } from '../helpers'
import { ExternalGroup } from '../../_utility_/types'

const getGroups = async () => {
  const groupData: any = await getSheetData(
    '1j3le3ZzbBS8QMF_4IKNI68AxTNandJQr2MeNtzaEcRk',
    'apoyo_mutuo_c19_y_vivienda'
  )

  const [titleRow, ...rows] = groupData.values
  const createGroup = groupConstructor(titleRow, {
    "import_location": "location_name",
    "name": "name",
    "import_url": "link_facebook",
  })

  const groups = rows
    .map((r: any) => createGroup(r))
    .filter((x: any) => x.location_name && x.name && x.link_facebook) as ExternalGroup[]

  return groups
}

const testCases = [
  {
    link_facebook: "https://t.me/apoionovomesoiro",
    links: [],
    location_name: "Novo Mesoiro – Feáns – Pocomaco, A Coruña, España",
    name: "GAM Novo Mesoiro – Feáns – Pocomaco"
  },
  {
    link_facebook: "https://chat.whatsapp.com/IRjVrhsrWi4G5uVyWh6ate",
    links: [],
    location_name: "Fuencarral, Madrid, España",
    name: "Cuidados de apoyo mutuo vecinal SALVA VIDAS"
  },
  {
    link_facebook: "https://www.facebook.com/groups/208662953818158/",
    links: [],
    location_name: ", Málaga, España",
    name: "Red Malaguita de Apoyo Mutuo"
  },
  {
    link_facebook: "https://www.facebook.com/PAH.Murcia",
    links: [],
    location_name: "Calle Arquitecto Emilio Perez Piñero,Murcia",
    name: "PAH Murcia"
  }
]

export const esLocalisedResources = createSource({
  displayName: "Grupos de Apoyo Mutuo COVID-19 España",
  external_id: "grupos-de-apoyo-mutuo-covid-19-espana",
  external_link: "https://docs.google.com/spreadsheets/d/1j3le3ZzbBS8QMF_4IKNI68AxTNandJQr2MeNtzaEcRk/edit#gid=1693486829",
  getGroups,
  testCases
})
