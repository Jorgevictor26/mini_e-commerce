import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  banners = [
    {
      title: 'As melhores ofertas em Eletrônicos',
      subtitle: 'Até 40% de desconto nesta semana!',
      buttonText: 'Confira agora',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070'
    },
    {
      title: 'Moda Masculina & Feminina',
      subtitle: 'Renove seu guarda-roupa com estilo.',
      buttonText: 'Ver Coleção',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070'
    }
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextBanner();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // Ir para o próximo (com lógica de loop)
  nextBanner() {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  // Voltar para o anterior
  prevBanner() {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }

  // Mudar manualmente e resetar o timer
  manualChange(index: number) {
    this.currentIndex = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
