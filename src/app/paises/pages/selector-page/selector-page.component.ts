import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisAPIResponse } from '../../interfaces/pais';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  //selectores
  continentes: string[] = [];
  paisesArr: PaisAPIResponse[] | null = [];
  fronterasArr: string[] | undefined = [];
  cargando: boolean = false;

  miFormulario: FormGroup = this.fb.group({
    continente: [, [Validators.required]],
    pais: [{ value: '', disabled: true }, [Validators.required]],
    frontera: [{ value: '', disabled: true }, [Validators.required]],
  });

  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.continentes = this.paisesService.continentes;
    this.miFormulario
      .get('continente')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset();
          this.miFormulario.get('frontera')?.reset();
          this.miFormulario.get('pais')?.disable();
          if (this.miFormulario.controls['continente'].value) {
            this.miFormulario.get('pais')?.enable();
          }
        }),
        switchMap((resp) => this.paisesService.paises(resp))
      )
      .subscribe((resp) => (this.paisesArr = resp));

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miFormulario.get('frontera')?.reset();
        }),

        switchMap((resp) => this.paisesService.fronteras(resp))
      )
      .subscribe((resp) => (this.fronterasArr = resp?.borders));
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
