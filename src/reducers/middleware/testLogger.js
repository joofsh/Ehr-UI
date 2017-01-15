export default function testLoggerMiddleware() {
  return store => next => action => {
    console.log('Dispatching action:', action.type);
    return next(action);
  };
}
