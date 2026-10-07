import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from './counter.service';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('CounterService', () => {
  let service: CounterService;

  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);

  const first: SavedCounter = {
    id: 'first',
    name: 'First',
    value: 1,
    createdAt: '2026-09-17T08:00:00.000Z',
  };

  const second: SavedCounter = {
    id: 'second',
    name: 'Second',
    value: 2,
    createdAt: '2026-09-17T09:00:00.000Z',
  };

  beforeEach(() => {
    // Vynulujeme počty volání mocků z předchozího testu.
    vi.clearAllMocks();

    // Výchozí stav: v Preferences zatím není uložená historie.
    getMock.mockResolvedValue({ value: null });

    // Zápis i odstranění ve výchozím stavu úspěšně skončí.
    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);

    // Pro každý test vytvoříme nové prostředí Angular dependency injection.
    TestBed.configureTestingModule({
      providers: [CounterService],
    });

    // Z testovacího injectoru získáme čerstvou instanci služby.
    service = TestBed.inject(CounterService);
  });

  it('should initialize only once', async () => {
    // Dvě volání bez čekání simulují souběžné požadavky na inicializaci.
    await Promise.all([service.initialize(), service.initialize()]);

    // Další volání proběhne až po dokončení první inicializace.
    await service.initialize();

    // Všechna volání musí sdílet jedinou operaci načtení Preferences.
    expect(getMock).toHaveBeenCalledTimes(1);

    // Služba dokončila inicializaci a při value: null má prázdnou historii.
    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
  });






  // TODO: samostatně doplňte testy scénářů 1–5 ze zadání.





   it('should load saved counters', async () => {
    getMock.mockResolvedValue({
      value: JSON.stringify([first, second]),
    });

    await service.initialize();

    expect(service.counters()).toEqual([first, second]);

    expect(service.initialized()).toBe(true);
  });

  it('should add a counter at the beginning and persist it', async () => {
    await service.initialize();

    const newCounter: SavedCounter = {
      id: 'new',
      name: 'New',
      value: 3,
      createdAt: '2026-09-17T10:00:00.000Z',
    };

    await service.add(newCounter);

    expect(service.counters()).toEqual([newCounter]);

    expect(setMock).toHaveBeenCalledTimes(1);

    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify([newCounter]),
    });
  });

  it('should remove only the matching counter and persist the new state', async () => {
    getMock.mockResolvedValue({
      value: JSON.stringify([first, second]),
    });

    await service.initialize();

    await service.remove('first');

    expect(service.counters()).toEqual([second]);

    expect(setMock).toHaveBeenCalledTimes(1);

    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify([second]),
    });
  });

  it('should clear the history and remove saved data', async () => {
    getMock.mockResolvedValue({
      value: JSON.stringify([first, second]),
    });

    await service.initialize();

    await service.clear();

    expect(service.counters()).toEqual([]);

    expect(removeMock).toHaveBeenCalledTimes(1);

    expect(removeMock).toHaveBeenCalledWith({
      key: 'saved-counters',
    });

    expect(setMock).not.toHaveBeenCalled();
  });

  it('should handle corrupted saved data', async () => {
    getMock.mockResolvedValue({
      value: 'this is not valid JSON',
    });

    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await service.initialize();

    expect(service.counters()).toEqual([]);

    expect(service.initialized()).toBe(true);
    
    expect(consoleErrorMock).toHaveBeenCalled();

    consoleErrorMock.mockRestore();
  });

});