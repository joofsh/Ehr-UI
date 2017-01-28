export default function testLoggerMiddleware() {
  return () => next => action => {
    console.log('Dispatching action:', action.type);
    return next(action);
  };
}
