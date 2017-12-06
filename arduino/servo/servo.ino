/* Sweep
 by BARRAGAN <http://barraganstudio.com>
 This example code is in the public domain.

 modified 8 Nov 2013
 by Scott Fitzgerald
 http://www.arduino.cc/en/Tutorial/Sweep
*/

#include <Servo.h>

Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards
int pos = 0;     // variable to store the servo position
int direction = 1; // Controls the direction of the motor (1 or -1)
int speed = 0;   // Controlds the speed of the motor

// Button stuff
int button_pin = 3;
bool button_flag = false;
int btn_val = -1;

// Potentiameter stuff
int pot_pin = 0;
int val = 0;

void setup() {
  Serial.begin(9600);

  myservo.attach(11);  // attaches the servo on pin 2 to the servo object
  // pinMode(button_pin, INPUT);
  // digitalWrite(button_pin, HIGH);
}

void loop() {
  // for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
  //   // in steps of 1 degree
  //   myservo.write(pos);              // tell servo to go to position in variable 'pos'
  //   delay(15);                       // waits 15ms for the servo to reach the position
  // }
  // for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
  //   myservo.write(pos);              // tell servo to go to position in variable 'pos'
  //   delay(15);                       // waits 15ms for the servo to reach the position
  // }

  // btn_val = digitalRead(button_pin);
  // if (button_flag == false && btn_val == LOW) { // Pressed button
  //   button_flag = true;
  // }
  // else if (button_flag == true && btn_val == HIGH) { // Released button, change direction
  //   button_flag = false;
  //   direction = 0 - direction;
  //   // Serial.println(direction);
  // }
  // val = analogRead(pot_pin);            // reads the value of the potentiometer (value between 0 and 1023)
  // Serial.println(val);
  // speed = map(val, 0, 1023, 0, 10);     // scale it to speed of the servo (value between 0 and 10)
  // speed = val / 200;
  speed = 1;
  speed = direction * speed;
  Serial.println(speed);
  pos = pos + speed;

  if (pos < 0)
    direction = direction * -1;
    // pos = 0;
  if (pos > 180)
    direction = direction * -1;
    // pos= 180;

  myservo.write(pos);
  Serial.println(pos);
  delay(15);
}