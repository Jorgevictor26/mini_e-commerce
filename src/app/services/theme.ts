import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly mode = signal<ThemeMode>('light');

  constructor() {
    const savedTheme = localStorage.getItem('mini-shop-theme') as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    this.setTheme(initialTheme);
  }

  toggleTheme() {
    this.setTheme(this.mode() === 'dark' ? 'light' : 'dark');
  }

  private setTheme(theme: ThemeMode) {
    this.mode.set(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('mini-shop-theme', theme);
  }
}
