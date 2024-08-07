import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounce, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { Item, Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 1000;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl()

  constructor(
    private livroService : LivroService
  ) { }

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.livroService.buscar(valorDigitado)),
    tap((retornoApi) => console.log('Requisições ao servidor',retornoApi)),
    map((items) => this.livrosResultadoParaLivros(items))
  )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map (item => {
      return new LivroVolumeInfo(item);
    })
  }
  
}



