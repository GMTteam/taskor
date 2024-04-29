export interface CategoriesType {
    id : string,
    name : string
    listTask : TaskItemData[]
}


export interface TaskItemData {
    id: string
    subject: string
    done: boolean
}


export interface CategoryType {
    id: string
    name: string
    listTask: TaskItemData[]
}

