import { UserState } from './user/type'
import { ResourceState } from './resource/type';
import { CardState } from './card/type';

export interface RootState {
  user: UserState,
  card: CardState
  resource:ResourceState
}