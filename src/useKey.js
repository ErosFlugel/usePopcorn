import { useEffect } from 'react';

export function useKey(key, onAction) {
  //We use an effect to escape from the react way of working. When we want to listen to an event happening in the entire DOM then we need to do it in the old Javascript way, that's why we use an addEventListener, we just want to listen to the Esc key press in the entire page
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          onAction();
        }
      }
      document.addEventListener('keydown', callback);

      //When we add an eventListener in an effect, if we want the effect to be called more than once (in the mounting component face from the life cycle) then we would be creating multiples event listeners in the DOM and that would create a whole performance issue so for that cases we can remove the events created with document.removeEventListener
      return function () {
        //It needs to contains the exact same function that we passed previously to create the event (needs to be stored in the exact same variable)
        document.removeEventListener('keydown', callback);
      };
    },
    [onAction, key]
  );
}
