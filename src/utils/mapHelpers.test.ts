import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBWAY_MAPS } from '../data/maps';
import { filterMaps, getUniqueCategories, isValidMap } from './mapHelpers';

test('SUBWAY_MAPS has all registered maps with valid structure', () => {
  assert.equal(SUBWAY_MAPS.length, 7);
  assert.equal(SUBWAY_MAPS[0].id, 'barcelona');
  assert.equal(SUBWAY_MAPS[1].id, 'classic');
  assert.equal(SUBWAY_MAPS[2].id, 'brawl-stars');
  assert.equal(SUBWAY_MAPS[3].id, 'arabia');
  assert.equal(SUBWAY_MAPS[4].id, 'copenhagen-super-runner');
  assert.equal(SUBWAY_MAPS[5].id, 'cosmic-crossroads');
  assert.equal(SUBWAY_MAPS[6].id, 'buenos-aires');

  for (const map of SUBWAY_MAPS) {
    assert.equal(isValidMap(map), true, `Map ${map.id} should be valid`);
  }
});

test('filterMaps filters by text search query correctly', () => {
  const resultBarcelona = filterMaps(SUBWAY_MAPS, { query: 'barcelona' });
  assert.equal(resultBarcelona.length, 1);
  assert.equal(resultBarcelona[0].id, 'barcelona');

  const resultArabia = filterMaps(SUBWAY_MAPS, { query: 'arabia' });
  assert.equal(resultArabia.length, 1);
  assert.equal(resultArabia[0].id, 'arabia');

  const resultEmpty = filterMaps(SUBWAY_MAPS, { query: 'nonexistent-map-xyz' });
  assert.equal(resultEmpty.length, 0);
});

test('filterMaps filters by category and featured status', () => {
  const featured = filterMaps(SUBWAY_MAPS, { category: 'featured' });
  assert.equal(featured.length, 7);

  const classics = filterMaps(SUBWAY_MAPS, { category: 'Clássicos' });
  assert.equal(classics.length, 1);
  assert.equal(classics[0].id, 'classic');

  const cities = filterMaps(SUBWAY_MAPS, { category: 'Cidades' });
  assert.equal(cities.length, 3); // Barcelona, Arabia, Buenos Aires
});

test('filterMaps handles favorites filtering', () => {
  const favorites = filterMaps(SUBWAY_MAPS, {
    onlyFavorites: true,
    favoriteIds: ['classic'],
  });
  assert.equal(favorites.length, 1);
  assert.equal(favorites[0].id, 'classic');
});

test('getUniqueCategories returns distinct category list', () => {
  const categories = getUniqueCategories(SUBWAY_MAPS);
  assert.ok(categories.includes('Cidades'));
  assert.ok(categories.includes('Especiais'));
  assert.ok(categories.includes('Clássicos'));
});

test('isValidMap rejects malformed maps', () => {
  assert.equal(isValidMap({}), false);
  assert.equal(isValidMap({ id: '1', name: 'test', description: 'desc', image: 'img', url: 'invalid-url' }), false);
});
