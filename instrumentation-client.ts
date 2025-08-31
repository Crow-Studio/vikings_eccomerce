import { initBotId } from 'botid/client/core';
initBotId({
  protect: [
    {
      path: '/api/checkout',
      method: 'POST',
    },
    {
      path: '/team/*/activate',
      method: 'POST',
    },
    {
      path: '/api/user/*',
      method: 'POST',
    },
  ],
});