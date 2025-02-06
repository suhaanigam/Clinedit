import { Component, AfterViewInit } from '@angular/core';

declare const color: any;
declare const vec: (x: number, y: number, z: number) => any;
declare const curve: (options: { pos: any; color: any; radius: any}) => any;
declare const canvas: (options?: { width?: number; height?: number }) => any;
declare const cylinder: any;
declare const turns: number;
declare const pitch: number;
declare const radius: number;
declare const width: 600;
declare const height: 600;

@Component({
  selector: 'app-glowscript',
  standalone: true,
  imports: [],
  templateUrl: './glowscript.component.html',
  styleUrls: ['./glowscript.component.css']
})

export class GlowscriptComponent implements AfterViewInit {

  ngAfterViewInit(): void {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
          console.warn('GlowScript cannot run on the server. Skipping initialization.');
          return;
      }

      console.log('Initializing GlowScript...');

      // Ensure the container exists
      const container = document.getElementById('glowscript');
      if (!container) {
        console.error('GlowScript container not found!');
        return;
      }

      // Initialize GlowScript
      (function () {
          function __main__() {
            const scene = canvas({ width: 400, height: 600 }); // Create a 3D canvas
            scene.background = vec(0.06666666666, 0.42745098039, 0.49411764705);
            scene.userzoom = false;
            //scene.forward = vec(2,1,1)
            scene.range = 5;

            // DNA Helix Visualization

            // Parameters for the helix
            const radius = 2; // Radius of the helix
            const pitch = 10; // Vertical spacing between turns
            const turns = 20; // Number of turns in the helix
            const pointsPerTurn = 100; // Smoothness of the helix
            const basePairsPerTurn = 8; // Number of base pairs per turn

            // Function to generate helix points
            function generateHelix(radius: number, pitch: number, turns: number, offset = 0) {
              const points = [];
              const totalPoints = turns * pointsPerTurn;

              for (let i = 0; i < totalPoints; i++) {
                const theta = (2 * Math.PI * i) / pointsPerTurn;
                const x = radius * Math.cos(theta + offset);
                const y = radius * Math.sin(theta + offset);
                const z = (pitch * i) / pointsPerTurn;
                points.push(vec(x, y, z));
              }

              return points;
            }

            function rotatePoints(points: any[], axis: string, angle: number): any[] {
              const rotatedPoints = [];
              const radianAngle = angle * (Math.PI / 180); // Convert degrees to radians
              const cosA = Math.cos(radianAngle);
              const sinA = Math.sin(radianAngle);

              for (const point of points) {
                let x, y, z;

                if (axis === 'x') {
                  // Rotate around the X-axis
                  x = point.x;
                  y = point.y * cosA - point.z * sinA;
                  z = point.y * sinA + point.z * cosA;
                } else if (axis === 'y') {
                  // Rotate around the Y-axis
                  x = point.x * cosA + point.z * sinA;
                  y = point.y;
                  z = -point.x * sinA + point.z * cosA;
                } else if (axis === 'z') {
                  // Rotate around the Z-axis
                  x = point.x * cosA - point.y * sinA;
                  y = point.x * sinA + point.y * cosA;
                  z = point.z;
                } else {
                  throw new Error('Invalid axis for rotation');
                }
                rotatedPoints.push(vec(x, y, z));
              }

              return rotatedPoints;
            }

            function centerHelix(points: any[]): any[] {
              // Calculate the midpoint of the helix along the Z-axis
              const zCoords = points.map((p: any) => p.z);
              const zMin = Math.min(...zCoords);
              const zMax = Math.max(...zCoords);
              const zMid = (zMin + zMax) / 2;

              // Shift all points to center the helix
              return points.map((p: any) => vec(p.x, p.y, p.z - zMid));
            }

            // Generate the two helices
            let helix1 = generateHelix(radius, pitch, turns);
            let helix2 = generateHelix(radius, pitch, turns, Math.PI);

            helix1 = centerHelix(helix1);
            helix2 = centerHelix(helix2);

            helix1 = rotatePoints(helix1, 'x', 90); // Rotate to stand vertically
            helix2 = rotatePoints(helix2, 'x', 90);

            const rnaHelix = curve({pos: helix1, color: vec(0.87, 0.92, 0.81), radius: 0.1});
            const sndRnaHelix = curve({pos: helix2, color: vec(0.87, 0.92, 0.81), radius: 0.1});

            const basePairs: Array<[typeof cylinder, typeof cylinder]> = [];
            const stepSize = Math.floor(pointsPerTurn / basePairsPerTurn);
            for (let i = 0; i < helix1.length; i += stepSize) {
              // Calculate the midpoint
              const midpoint = vec(
                (helix1[i].x + helix2[i].x) / 2,
                (helix1[i].y + helix2[i].y) / 2,
                (helix1[i].z + helix2[i].z) / 2
              );

              // Create the two half-cylinders
              const basePair1 = cylinder({
                pos: helix1[i],
                axis: midpoint.sub(helix1[i]),
                radius: 0.07,
                color: vec(0.996, 0.949, 0.541)
              });

              const basePair2 = cylinder({
                pos: helix2[i],
                axis: midpoint.sub(helix2[i]),
                radius: 0.07,
                color: vec(0.537, 0.588, 0.996)
              });

              // Store the cylinders
              basePairs.push([basePair1, basePair2]);
            }

            function rotateAroundAxis(point: any, axis: any, angle: any) {
              const cosA = Math.cos(angle);
              const sinA = Math.sin(angle);
              const dotProduct = point.x * axis.x + point.y * axis.y + point.z * axis.z;

              return vec(
                point.x * cosA + (1 - cosA) * dotProduct * axis.x + sinA * (axis.y * point.z - axis.z * point.y),
                point.y * cosA + (1 - cosA) * dotProduct * axis.y + sinA * (axis.z * point.x - axis.x * point.z),
                point.z * cosA + (1 - cosA) * dotProduct * axis.z + sinA * (axis.x * point.y - axis.y * point.x)
              );
            }

            let time = 0;
            const rotationAxis = vec(0, 1, 0); // Rotated Y-axis
            function animate() {
              time += 0.05;
              const angle = time * 0.3;

              for (let i = 0; i < helix1.length; i++) {
                const point1 = helix1[i];
                const point2 = helix2[i];

                const newPos1 = rotateAroundAxis(point1, rotationAxis, angle);
                const newPos2 = rotateAroundAxis(point2, rotationAxis, angle);

                //const angle = time * 0.3;
                //const cosA = Math.cos(angle);
                //const sinA = Math.sin(angle);

              /*
                const newPos1 = vec(
                  helix1[i].x * cosA + helix1[i].z * sinA, // Rotates around Y-axis
                  helix1[i].y,
                  -helix1[i].x * sinA + helix1[i].z * cosA
                );

                const newPos2 = vec(
                  helix2[i].x * cosA + helix2[i].z * sinA, // Rotates around Y-axis
                  helix2[i].y,
                  -helix2[i].x * sinA + helix2[i].z * cosA
                );
               */

                rnaHelix.modify(i, newPos1);
                sndRnaHelix.modify(i, newPos2);

                if (i % stepSize === 0) {
                  const basePairIndex = Math.floor(i / stepSize);
                  const midpoint = vec(
                    (newPos1.x + newPos2.x) / 2,
                    (newPos1.y + newPos2.y) / 2,
                    (newPos1.z + newPos2.z) / 2
                  );


                  basePairs[basePairIndex][0].pos = newPos1;
                  basePairs[basePairIndex][0].axis = midpoint.sub(newPos1);
                  basePairs[basePairIndex][1].pos = newPos2;
                  basePairs[basePairIndex][1].axis = midpoint.sub(newPos2);
                }
              }
              requestAnimationFrame(animate);
            }
            animate();
          }

          // Bind GlowScript to the container
          window.__context = { glowscript_container: document.getElementById('glowscript') };
          __main__();
        })();
    }
}
