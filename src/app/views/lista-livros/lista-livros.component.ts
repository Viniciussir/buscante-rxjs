import { LivrosResultado } from './../../models/interfaces';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subscription, catchError, debounce, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
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

  campoBusca = new FormControl();

  mensagemErro:string = '';

  livrosResultado:LivrosResultado;

  constructor(
    private livroService : LivroService
  ) { }

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    tap(() => {
      console.log('Fluxo inicial de dados');
    }),
    filter(
      (valorDigitado) => valorDigitado.length >= 3
    ),
    switchMap(
      (valorDigitado) => this.livroService.buscar(valorDigitado)
    ),
    map(resultado => this.livrosResultado = resultado),
    map(resultado => resultado.items ?? []),
    map(items => this.livrosResultadoParaLivros(items)),
    catchError(erro =>
      { console.log(erro);
        return throwError(() =>
        new Error(this.mensagemErro = `Ops, ocorreu um erro! Recarregue a aplicação!`));
      })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map (item => {
      return new LivroVolumeInfo(item);
    })
  }
  
}



