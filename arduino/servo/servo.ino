#include <Servo.h>
#include <TimerObject.h>

const static int YEAR = 4096;
const static int MONTH = 341;

/* Data */
int counter = 0;
int curr_year = 0;
int curr_month = 0;
const static int tree_data[4] = {9, 325, 449, 628};
const static long zillow_data[4][12] =
{{159200, 156700, 153650, 151150, 149400, 147700, 145650, 143550, 141550, 140450, 139550, 138900},
{138300, 137700, 137700, 137300, 136550, 137050, 139300, 141550, 143350, 144550, 145600, 146900},
{148100, 149550, 151700, 154350, 156450, 158750, 161650, 163700, 164950, 167150, 169750, 171800},
{173700, 175550, 177400, 179950, 182250, 183400, 183700, 184400, 185900, 186850, 188350, 191000}};

/* Stepper Motor */
const static int stepper_motor_pins[4] = {10, 11, 12, 13};
int step_mode = 1; // 0 for stopping
int curr_step = 0;
const static boolean cycle[8][4] = {{true,false,false,false},
                                    {true,true,false,false},
                                    {false,true,false,false},
                                    {false,true,true,false},
                                    {false,false,true,false},
                                    {false,false,true,true},
                                    {false,false,false,true},
                                    {true,false,false,true}};


/* Time Interval */
TimerObject *timer1;
int step_interval = 4;

/* Servo */
Servo servo_tree;  // create servo object to control a servo
int pos_tree = 0;     // variable to store the servo position
int speed_tree = 0;   // Controlds the speed of the motor
int pos_goal_tree = 0;

Servo servo_zillow;  // create servo object to control a servo
int pos_zillow = 0;     // variable to store the servo position
int speed_zillow = 0;   // Controlds the speed of the motor
int pos_goal_zillow = 0;

/* Potentiameter stuff */
int pot_pin = 0;
int val = 0;

void setup() {
    Serial.begin(9600);

    for(int i = 0; i < 4; i++){
        pinMode(stepper_motor_pins[i], OUTPUT);
    }

    timer1 = new TimerObject(step_interval); //will call the callback in the interval of 1000 ms
    timer1->setOnTimer(&step);
    timer1->Start(); //start the thread.

    servo_tree.attach(2);  // attaches the servo on pin 2 to the servo object
    servo_zillow.attach(3);  // attaches the servo on pin 2 to the servo object

    initialize();
    // pos_goal_tree = 0;
    // pos_zillow = 0;
}

void loop() {
    timer1->Update();
    // Serial.println(counter);


    if (counter % 15 == 0) {
    // Stepper motor - Tree
        pos_tree = pos_tree + speed_tree;
        if (speed_tree > 0 && pos_tree > pos_goal_tree) {
            speed_tree = 0;
            pos_tree = pos_goal_tree;
        } else if (speed_tree < 0 && pos_tree < pos_goal_tree) {
            speed_tree = 0;
            pos_tree = pos_goal_tree;
        }
        // Serial.println(pos_tree);
        servo_tree.write(pos_tree);


    // Stepper motor - Zillow
        pos_zillow = pos_zillow + speed_zillow;
        if (speed_zillow > 0 && pos_zillow > pos_goal_zillow) {
            speed_zillow = 0;
            pos_zillow = pos_goal_zillow;
        } else if (speed_zillow < 0 && pos_zillow < pos_goal_zillow) {
            speed_zillow = 0;
            pos_zillow = pos_goal_zillow;
        }
        // Serial.println(pos_zillow);
        servo_zillow.write(pos_zillow);

    }


}

void step() {
    // Serial.println("Stepping");
    if(step_mode == 0){
        return;
    }
    const boolean* step_val = cycle[curr_step];
    for(int i = 0; i < 4; i++){
        digitalWrite(stepper_motor_pins[i], step_val[i]);
    }

    counter++;
    if (counter >= YEAR) { // Pass 1 year
        curr_year++;
        if (curr_year > 3) {
            curr_year = 3;
            step_mode = 0; // STOP
            return;
        }
        tree_servo_goto(tree_data[curr_year]);

        counter = 0;
    }

    if (counter % MONTH == 0) { // Pass a month
        curr_month++;
        if (curr_month > 11) { // Pass a whole year, go back to -1 (so add one become 0 next time)
            curr_month = -1;
        } else {
            zillow_servo_goto(zillow_data[curr_year][curr_month]);
        }

    }

    curr_step ++;
    if (curr_step == 8) {
        curr_step = 0;
    }
    // curr_step %= 8;
}

void tree_servo_goto(int num_trees) {
    int position = map(num_trees, 0, 628, 45, 135);
    int direction = (position > pos_tree) ? 1 : -1;
    speed_tree = 1 * direction;
    pos_goal_tree = position;
    Serial.print(curr_year);
    Serial.println(" NEW YEAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
}

// MAX - MIN = 191000 - 136550 = 54450
void zillow_servo_goto(float value) {
    int position = map(value, 136550, 191000, 45, 135);
    // int position = (value - 136550) / 54450 * 90 + 45;
    int direction = (position > pos_zillow) ? 1 : -1;
    speed_zillow = 1 * direction;
    pos_goal_zillow = (int) position;
    Serial.print("Month->");
    Serial.print(curr_month);
    Serial.print("   goal->");
    Serial.println(position);
}

void initialize() {
    tree_servo_goto(0);
    zillow_servo_goto(zillow_data[0][0]);
}