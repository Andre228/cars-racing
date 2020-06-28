import {Injectable} from "@angular/core";
import {CarsObstacle} from "../track/track.component";


@Injectable()
export class CarService {

  drawCar(canvasContext, obstacleObj: CarsObstacle, square, tt?): void {

    canvasContext.fillStyle = obstacleObj.color || 'blue';
    canvasContext.fillRect(obstacleObj.obstacleX + square, obstacleObj.obstacleY, square, square * 4);
    canvasContext.fillStyle = 'darkgray';
    canvasContext.fillRect(obstacleObj.obstacleX, obstacleObj.obstacleY + square - 12.5, 20, 20);
    canvasContext.fillRect(obstacleObj.obstacleX + square * 2.2, obstacleObj.obstacleY + square - 12.5, 20, 20);
    canvasContext.fillRect(obstacleObj.obstacleX, obstacleObj.obstacleY + 3 * square - 10, 20, 20);
    canvasContext.fillRect(obstacleObj.obstacleX + square * 2.2, obstacleObj.obstacleY + 3 * square - 10, 20, 20);
  }

}
