import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @ViewChild('container') private modal: ElementRef;
  @ViewChild('background') private background: ElementRef;

  @Output() play = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();
  @Output() resume = new EventEmitter<boolean>();
  @Output() musicVolumeChange = new EventEmitter<number>();

  @Input() private isStartGame: boolean = false;
  @Input() private musicVolume: number = 1;
  private isCrash: boolean = false;

  private resultMessage: number = 0;

  constructor() { }

  ngOnInit() {
  }

  open(isCrash?: boolean, resultMessage?: number): void {
    if (isCrash) {
      this.isCrash = isCrash;
      this.resultMessage = resultMessage;
    }
    this.modal.nativeElement.style.display = 'block';
    this.background.nativeElement.style.display = 'block';
  }

  close(): void {
    this.modal.nativeElement.style.display = 'none';
    this.background.nativeElement.style.display = 'none';
    this.isCrash = false;
    this.resultMessage = 0;
  }

  private playGame(): void {
    this.play.emit();
    this.close();
  }

  private restartGame(): void {
    this.restart.emit();
    this.close();
  }

  private resumeGame(): void {
    this.resume.emit(false);
    this.close();
  }

  private changeMusicVolume(event): void {
    if (event.target.value) this.musicVolumeChange.emit(parseFloat(event.target.value));
    else this.musicVolumeChange.emit(1);
  }

}
