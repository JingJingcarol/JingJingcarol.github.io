import { ResourceModel,ResourceCollection } from '@/src/models/resource'
export interface ResourceState {
    resourceCollection:ResourceCollection;
    resources:ResourceModel[];
    types:string[];
    currentType:string;
}