import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IconComponent } from './icon/icon.component';
import { IconDirective } from './icon/icon.directive';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    IconDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <h2>Angular: &lt;app-icon&gt;</h2>
    <section>
      <app-icon name="star" class="big red" />
      <button><app-icon name="search" /> Search</button>
      <button aria-label="Delete"><app-icon name="trash" /></button>
    </section>

    <h2>Angular Material: mat-icon[icon]</h2>
    <section>
      <button mat-icon-button aria-label="Delete">
        <mat-icon icon="trash" />
      </button>

      <button mat-flat-button>
        <mat-icon icon="star" />
        Add to favorites
      </button>

      <mat-form-field>
        <mat-icon matIconPrefix icon="search" />
        <input matInput placeholder="Search" />
      </mat-form-field>
    </section>
  `,
})
export class App {}
