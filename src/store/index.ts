import { createStore, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from '@/store/reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';

const config = {
  key: 'mysawit-admin',
  storage,
};

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const persistedReducer = persistReducer(config, reducer);

const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export { persistor, store };
