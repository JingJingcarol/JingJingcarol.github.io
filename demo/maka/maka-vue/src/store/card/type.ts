import { CardModel } from '@/src/models/card'
export interface CardState {
    pages:CardModel[],
    currentPage:CardModel,
    editResource:string;
}