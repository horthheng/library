const express = require('express');

function apiResource(path, controller, middlewares = {}) {
  const router = require('express').Router();

  if (typeof controller.index === 'function') {
    router.get('/', ...(middlewares.index || []), controller.index);
  }
  if (typeof controller.store === 'function') {
    router.post('/', ...(middlewares.store || []), controller.store);
  }
  if (typeof controller.show === 'function') {
    router.get('/:id', ...(middlewares.show || []), controller.show);
  }
  if (typeof controller.update === 'function') {
    router.put('/:id', ...(middlewares.update || []), controller.update);
  }
  if (typeof controller.destroy === 'function') {
    router.delete('/:id', ...(middlewares.destroy || []), controller.destroy);
  }

  return { path, router };
}

module.exports = apiResource;