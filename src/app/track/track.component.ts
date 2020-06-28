import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {DOCUMENT} from "@angular/common";
import {CarService} from "../services/car-service";
import {ModalComponent} from "../widgets/modal/modal.component";

export interface CarsObstacle {
  obstacleX: number;
  obstacleY: number;
  color: string;
}

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css'],
  providers: [CarService]
})
export class TrackComponent implements OnInit, OnDestroy {

  @ViewChild('track') private track: ElementRef;
  @ViewChild(ModalComponent) private modal: ModalComponent;
  private canvasContext;

  private columns: number = 12;
  private rows: number = 24;
  private square: number = 25;
  private obstacleY: number = 0;
  private controlCarX: number = this.getRandomPosition();
  private controlCarY: number = 500;
  private obstacleSpeed: number = 2;
  private score: number = 0;
  private goal: number = 0;
  private scoresResults: number [] = [];
  private musicVolume: number = 0.1;

  private colors: string [] = [ 'yellow', 'blue', '#00FFFF', '#9400D3', '#FF9933', '#79443B', '#FF7F50' ];

  private carsObstacles: CarsObstacle [] = [];

  private isStop: boolean = false;
  private isRight: boolean = false;
  private isLeft: boolean = false;
  private isUp: boolean = false;
  private isDown: boolean = false;
  private isStartGame: boolean = false;
  private isPlayAudio: boolean = false;

  private audio = new Audio('http://localhost:4200/assets/audio/Jumpstarter - Cyborg (Original Mix).mp3') as HTMLAudioElement;

  private destroyIntervalTimeline: Subscription;
  private destroyIntervalBoostObstacleSpeed: Subscription;
  private destroyIntervalVolume: Subscription;

  constructor(@Inject(DOCUMENT) private document: Document,
              private carService: CarService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.destroyIntervalTimeline) {
      this.destroyIntervalTimeline.unsubscribe();
    }
    if (this.destroyIntervalBoostObstacleSpeed) {
      this.destroyIntervalBoostObstacleSpeed.unsubscribe();
    }
    this.removeEvents();
  }

  private drawTrack(): void {

    const track = this.track.nativeElement as HTMLCanvasElement;
    this.canvasContext = track.getContext('2d') as CanvasRenderingContext2D;

    this.canvasContext.clearRect(0, 0, track.width, track.height);

    for (let i = 0; i < this.columns * this.square; i += this.square) {
      for (let j = 0; j < this.rows * this.square; j += this.square) {

        this.canvasContext.strokeStyle = 'green';
        this.canvasContext.strokeRect(i, j, 25, 25);

        this.canvasContext.fillStyle = 'pink';
        this.canvasContext.fillRect(6 * this.square, this.obstacleY + this.getRandomPosition() - 100, 25, 100);
        this.canvasContext.fillRect(5 * this.square, this.obstacleY + this.getRandomPosition() - 100, 25, 100);

        this.canvasContext.fillRect(6 * this.square, this.obstacleY + this.getRandomPosition() - 500, 25, 100);
        this.canvasContext.fillRect(5 * this.square, this.obstacleY + this.getRandomPosition() - 500, 25, 100);

      }

    }
    this.score += 1;


    this.carService.drawCar(this.canvasContext, this.carsObstacles[0], this.square);
    this.carService.drawCar(this.canvasContext, this.carsObstacles[1], this.square);

  }

  private drawControlCar(x: number, y: number): void {
    this.controlCarX = x;
    this.controlCarY = y;
    this.carService.drawCar(this.canvasContext, {obstacleX: this.controlCarX, obstacleY: this.controlCarY, color: 'red'}, this.square);
  }

  private updateObstacles(): void {
    if (!this.isStop) {
      this.obstacleY += this.obstacleSpeed;
      this.carsObstacles[0].obstacleY += this.obstacleSpeed;
      this.carsObstacles[1].obstacleY += this.obstacleSpeed;
    }

    if (this.carsObstacles[0].obstacleY > this.track.nativeElement.height + this.square) {
      this.carsObstacles[0].obstacleX = this.getRandomPosition();
      this.carsObstacles[0].obstacleY = this.getRandomYPosition();
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.carsObstacles[0].color = color;
      this.goal += 1;
      this.obstacleY = 0;
    }

    if (this.carsObstacles[1].obstacleY > this.track.nativeElement.height + this.square) {
      this.carsObstacles[1].obstacleX = this.getRandomPosition();
      this.carsObstacles[1].obstacleY = Math.random() < 0.5 ? this.carsObstacles[0].obstacleY - 300 : this.carsObstacles[0].obstacleY - 375;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.carsObstacles[1].color = color;
      this.goal += 1;
      this.obstacleY = 0;
    }

    this.drawTrack();
  }

  private moveCar(): void {

    if (this.isLeft && !this.isStop && this.controlCarX - this.square >= 0) {
      this.controlCarX -= this.square;
      this.isLeft = false;
      this.isRight = false;
    }
    if (this.isRight && !this.isStop && this.controlCarX + 4 * this.square <= this.track.nativeElement.width) {
      this.controlCarX += this.square;
      this.isRight = false;
      this.isLeft = false;
    }

    if (this.isUp && !this.isStop && this.controlCarY !== 0) {
        this.controlCarY -= this.square;
        this.isUp = false;
        this.isDown = false;
    }

    if (this.isDown && !this.isStop && this.controlCarY + 4 * this.square !== this.track.nativeElement.height) {
      this.controlCarY += this.square;
      this.isDown = false;
      this.isUp = false;
    }

    this.checkForFailure();

    this.drawControlCar(this.controlCarX, this.controlCarY);

  }

  private getRandomYPosition(): number {
    const min = Math.ceil(0);
    const max = Math.floor(-300);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private getRandomPosition(bool?: boolean): number {
    return Math.random() < 0.3 ? 0 : Math.random() > 0.6 ? 3 * this.square : Math.random() > 0.7 ? 9 * this.square : 6 * this.square;
  }

  private checkForFailure(): void {

    this.carsObstacles.forEach(car => {

      const isCarOneLeave = car.obstacleY + 1.5 * this.square >= this.track.nativeElement.height;
      const carOneYBottom = parseFloat((car.obstacleY + 3 * this.square).toFixed(0));
      const carOneYTop = parseFloat((car.obstacleY - 3 * this.square).toFixed(0));

      if (
        (    car.obstacleX === this.controlCarX
          || car.obstacleX + this.square === this.controlCarX
          || car.obstacleX - this.square === this.controlCarX
          || car.obstacleX + 2 * this.square === this.controlCarX
          || car.obstacleX - 2 * this.square === this.controlCarX
        )
        &&   (  this.controlCarY === car.obstacleY
        || (( ( this.controlCarY <= carOneYBottom ) && ( this.controlCarY >= carOneYTop ) ) && !isCarOneLeave))
      ) {
        this.isStop = true;
        this.audio.pause();
        this.scoresResults.push(this.score);
        this.modal.open(true, this.getBestResult());
      }
    });

  }

  private drawGame(): void {
    if (!this.isStop) {
      this.updateObstacles();
      this.moveCar();
    }
  }

  private restart(): void {
    this.audio.play();
    this.isStop = false;
    this.obstacleY = this.getRandomPosition();
    this.carsObstacles[0].obstacleY = this.getRandomPosition();
    this.carsObstacles[0].obstacleX = this.getRandomPosition();
    this.carsObstacles[1].obstacleY = this.carsObstacles[0].obstacleY - 200;
    this.carsObstacles[1].obstacleX = this.getRandomPosition();
    this.controlCarX = this.getRandomPosition();
    this.score = 0;
    this.goal = 0;
    this.obstacleSpeed = 2;
  }

  private getBestResult(): number {
    return this.scoresResults.length ? Math.max.apply(null, this.scoresResults) : 0;
  }

  private createTimeline(): void {
    const timeline = interval(10);
    const boostSpeed = interval(3500);
    this.destroyIntervalTimeline = timeline.subscribe(() => {
      this.drawGame();
    });
    this.destroyIntervalBoostObstacleSpeed = boostSpeed.subscribe(() => {
      if (!this.isStop) {
        this.obstacleSpeed += 0.2;
        this.obstacleSpeed = parseFloat(this.obstacleSpeed.toFixed(1));
      }

    });
  }

  private bindEvents(): void {
     this.document.addEventListener('keydown', this.setDirectionMovement.bind(this));
  }

  private setDirectionMovement(event): void {
    if (event.code === 'ArrowLeft') {
      this.isLeft = true;
    }
    if (event.code === 'ArrowRight') {
      this.isRight = true;
    }
    if (event.code === 'ArrowUp') {
      this.isUp = true;
    }
    if (event.code === 'ArrowDown') {
      this.isDown = true;
    }
  }

  private removeEvents(): void {
    this.document.removeEventListener('keydown', this.setDirectionMovement);
  }

  private play(): void {
    this.modal.open();
  }

  private pause(): void {
    this.isStop = true;
    this.audio.pause();
    this.modal.open();
  }

  private resume(isResume: boolean): void {
    this.audio.play();
    this.isStop = isResume;
  }

  private musicVolumeChange(step: number): void {
    this.audio.volume = step;
    if (step) {
      this.destroyIntervalVolume.unsubscribe();
    }
  }

  private startGame(): void {

    this.isStartGame = true;

    this.carsObstacles.push({obstacleX: this.getRandomPosition(), obstacleY: 0, color: 'blue'});
    this.carsObstacles.push({obstacleX: this.getRandomPosition(), obstacleY: -250, color: 'green'});
    this.controlCarX = this.getRandomPosition();
    this.controlCarY = 500;

    this.createTimeline();
    this.bindEvents();
    this.loadAudio();
  }

  private loadAudio(): void {

    if (!this.isPlayAudio) {
      this.audio.load();
      this.audio.play();
      this.audio.loop = true;
    }

    this.audio.volume = this.musicVolume;
    this.destroyIntervalVolume = interval(1000).subscribe(() => {
      if (this.audio.volume !== 1) {
        this.audio.volume += parseFloat(0.1.toFixed(1));
        this.audio.volume = this.musicVolume = parseFloat(this.audio.volume.toFixed(1));
      } else {
        this.destroyIntervalVolume.unsubscribe();
      }
    });

    this.isPlayAudio = true;
  }

}
