import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  @Input() private score: number = 0;
  @Input() private bestResult: number = 0;
  @Input() private speed: number = 0;
  @Input() private goal: number = 0;

  constructor() { }

  ngOnChanhes(simplyChanges: SimpleChanges) {

  }

  ngOnInit() {

  }

}
