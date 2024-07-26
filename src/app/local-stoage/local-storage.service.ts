import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public string = {
    get: (key: string) => localStorage.getItem(key) as string | null,
    set: (key: string, value: string) => localStorage.setItem(key, value),
  }

  public number = {
    get: (key: string) => Number(localStorage.getItem(key)) as number | null,
    set: (key: string, value: number) => localStorage.setItem(key, String(value)),
  }

  public object = {
    get: <Type>(key: string) => JSON.parse(localStorage.getItem(key) ?? '{}') as Type | null,
    set: (key: string, value: Object) => localStorage.setItem(key, JSON.stringify(value)),
  }

  public array = {
    get: <Type>(key: string) => JSON.parse(localStorage.getItem(key) ?? '[]') as Type[] | null,
    set: (key: string, value: any[]) => localStorage.setItem(key, JSON.stringify(value)),
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
  
}
