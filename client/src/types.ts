export interface Model {
  id: number
  html: string
  fileName: string
  previewImageName: string
  collection: Collection[] | []
  detailsDocumentation: DetailDoc[] | []
}

export interface Collection {
  modelId: number
  title: string
  details: string[]
}


export interface DetailDoc {
  modelId: number
  detailId: string
  documentation: string
}