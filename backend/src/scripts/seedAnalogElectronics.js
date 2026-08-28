const mongoose = require('mongoose');
require('dotenv').config();
const Note = require('../models/Note');
const Subject = require('../models/Subject');
const User = require('../models/User');

const seedAnalogElectronics = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is missing.');
      }
      if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://". Do not use a placeholder.');
      }
      
      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri);
    }
    console.log('Connected to MongoDB.');

    // Ensure Admin exists (as author)
    let admin = await User.findOne({ role: 'Admin' });
    if (!admin) {
      admin = await User.findOne({});
      if (!admin) {
        console.log('No user found to assign as author. Creating dummy admin...');
        admin = await User.create({
          name: 'Admin',
          email: 'admin@careercompass.com',
          password: 'password123',
          role: 'Admin',
          isVerified: true
        });
      }
    }

    let subject = await Subject.findOne({ name: 'Analog Electronics' });
    if (!subject) {
      subject = await Subject.findOne({ code: 'ECE-AE' });
    }
    
    if (!subject) {
      throw new Error('Analog Electronics subject not found. Please ensure the subject exists.');
    }

    const chapters = [
      {
        chapterNumber: 1,
        title: 'Semiconductor Fundamentals',
        shortDescription: 'Basic physics of semiconductors, energy bands, and charge carriers.',
        content: `
# Semiconductor Fundamentals

Analog electronics is fundamentally built upon semiconductor materials, primarily Silicon (Si) and Germanium (Ge). 

## Energy Band Theory
- **Insulators:** Large energy gap (Eg > 3eV) between valence and conduction bands.
- **Conductors:** Overlapping valence and conduction bands (Eg = 0).
- **Semiconductors:** Small energy gap (Eg ~ 1.1eV for Si, 0.67eV for Ge). At absolute zero, they act as insulators. At room temperature, thermal energy excites some electrons to the conduction band.

## Types of Semiconductors
1. **Intrinsic Semiconductors:** Pure semiconductor without any significant dopant species present.
2. **Extrinsic Semiconductors:** Doped with impurities to alter their electrical properties.
   - **N-Type:** Doped with pentavalent impurities (e.g., Phosphorus, Arsenic). Majority carriers are electrons.
   - **P-Type:** Doped with trivalent impurities (e.g., Boron, Gallium). Majority carriers are holes.

## Mass Action Law
In thermal equilibrium, the product of electron concentration (n) and hole concentration (p) is constant:
**n * p = ni²**
(where ni is the intrinsic carrier concentration).
        `,
        topics: ['Semiconductors', 'Energy Bands', 'Doping', 'Mass Action Law'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'Silicon energy gap is ~1.1eV, Germanium is ~0.67eV.',
          'N-type materials use pentavalent doping; P-type use trivalent doping.',
          'Mass action law states n*p = ni².'
        ],
        questions2Mark: [
          'Define intrinsic and extrinsic semiconductors.',
          'State the Mass Action Law.'
        ],
        questions5Mark: [
          'Explain the energy band diagram of conductors, insulators, and semiconductors.'
        ],
        questions10Mark: [
          'Detail the process of doping and how it creates N-type and P-type semiconductors, including the Fermi level shifts.'
        ],
        mcqs: [
          {
            question: 'Which of the following is a pentavalent impurity?',
            options: ['Boron', 'Phosphorus', 'Gallium', 'Indium'],
            correctAnswer: 'Phosphorus',
            explanation: 'Phosphorus has 5 valence electrons, making it a pentavalent (donor) impurity used to create N-type semiconductors.'
          }
        ]
      },
      {
        chapterNumber: 2,
        title: 'PN Junction Diode',
        shortDescription: 'Formation, depletion region, and V-I characteristics of a PN junction.',
        content: `
# PN Junction Diode

When a P-type semiconductor is suitably joined to an N-type semiconductor, the contact surface is called a PN junction.

## Depletion Region
At the junction, electrons from the N-region diffuse into the P-region and recombine with holes, and vice-versa. This leaves behind immobile positive ions in the N-region and negative ions in the P-region, creating a region depleted of mobile charge carriers. The built-in potential barrier (V0) prevents further diffusion.
- **Barrier Potential:** ~0.7V for Silicon, ~0.3V for Germanium.

## Biasing the PN Junction
1. **Forward Bias:** Positive terminal connected to P, negative to N. The applied voltage opposes the barrier potential. The depletion width decreases, and current flows easily (exponential increase).
2. **Reverse Bias:** Positive terminal connected to N, negative to P. The applied voltage aids the barrier potential. The depletion width increases, and only a tiny leakage current flows due to minority carriers.

## V-I Characteristics
The diode current equation is given by Shockley's equation:
**I = I0 * (e^(V/ηVT) - 1)**
Where I0 is reverse saturation current, V is applied voltage, VT is thermal voltage (~26mV at room temp), and η is the ideality factor (1 or 2).
        `,
        topics: ['PN Junction', 'Depletion Region', 'Biasing', 'V-I Characteristics'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'Depletion region is devoid of mobile charge carriers.',
          'Forward bias decreases depletion width; reverse bias increases it.',
          'Cut-in voltage is 0.7V for Si, 0.3V for Ge.'
        ],
        questions2Mark: [
          'What is the depletion region in a PN junction?',
          'What is the value of thermal voltage at room temperature?'
        ],
        questions5Mark: [
          'Explain the formation of the depletion region and built-in potential in a PN junction.'
        ],
        questions10Mark: [
          'Draw and explain the V-I characteristics of a PN junction diode under forward and reverse bias conditions.'
        ],
        mcqs: [
          {
            question: 'In a reverse-biased PN junction, the current is primarily due to:',
            options: ['Majority carriers', 'Minority carriers', 'Both', 'Neither'],
            correctAnswer: 'Minority carriers',
            explanation: 'Under reverse bias, the barrier prevents majority carrier flow. The tiny leakage current is due to minority carriers drifting across the junction.'
          }
        ]
      },
      {
        chapterNumber: 3,
        title: 'Diode Applications',
        shortDescription: 'Rectifiers, clippers, clampers, and voltage multipliers.',
        content: `
# Diode Applications

The unidirectional current flow property of the PN junction diode makes it useful for various analog circuits.

## Rectifiers
Rectifiers convert AC voltage to pulsating DC voltage.
1. **Half-Wave Rectifier (HWR):** Uses one diode. Conducts only during the positive half cycle. Efficiency = 40.6%, Ripple Factor = 1.21.
2. **Full-Wave Rectifier (FWR):** Uses two diodes (center-tapped) or four diodes (bridge). Conducts during both half cycles. Efficiency = 81.2%, Ripple Factor = 0.48.

## Clippers
Clipping circuits (limiters) shape a waveform by removing portions of the applied signal above or below a specified reference level without distorting the remaining part.

## Clampers
Clamping circuits shift the entire waveform either positively or negatively to a defined reference DC level. They are also known as DC restorers. A capacitor, a diode, and a resistor are required.

## Peak Detectors and Voltage Multipliers
By utilizing capacitors in conjunction with diodes, circuits can be built to output a DC voltage equal to the peak of the AC input, or integer multiples of the peak (e.g., voltage doubler).
        `,
        topics: ['Rectifiers', 'Clippers', 'Clampers', 'Voltage Multipliers'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'HWR efficiency is 40.6%; FWR efficiency is 81.2%.',
          'Bridge rectifier requires 4 diodes and does not need a center-tapped transformer.',
          'Clampers shift the DC level of the signal; clippers cut off parts of the signal.'
        ],
        questions2Mark: [
          'What is ripple factor?',
          'Define clipping and clamping.'
        ],
        questions5Mark: [
          'Compare Half-Wave and Full-Wave Bridge rectifiers based on efficiency, ripple factor, and PIV.'
        ],
        questions10Mark: [
          'Explain the working of a Full-Wave Bridge Rectifier with relevant circuit diagrams and waveforms. Derive its efficiency.'
        ],
        mcqs: [
          {
            question: 'What is the Peak Inverse Voltage (PIV) rating required for a diode in a bridge rectifier?',
            options: ['Vm', '2Vm', 'Vm/2', '4Vm'],
            correctAnswer: 'Vm',
            explanation: 'In a bridge rectifier, the PIV across the non-conducting diodes is equal to the peak input voltage (Vm).'
          }
        ]
      },
      {
        chapterNumber: 4,
        title: 'Zener Diode and Voltage Regulation',
        shortDescription: 'Zener breakdown, avalanche breakdown, and voltage regulators.',
        content: `
# Zener Diode and Voltage Regulation

A Zener diode is a heavily doped PN junction diode designed to operate in the reverse breakdown region without damage.

## Breakdown Mechanisms
1. **Zener Breakdown:** Occurs in heavily doped diodes. The depletion layer is very narrow. A strong electric field across the narrow junction ruptures covalent bonds, creating electron-hole pairs. Typically occurs at voltages below 6V. Temperature coefficient is negative.
2. **Avalanche Breakdown:** Occurs in lightly doped diodes with wider depletion layers. Minority carriers accelerate under the electric field, colliding with atoms and knocking out electrons, creating an avalanche effect. Typically occurs at voltages above 6V. Temperature coefficient is positive.

## Voltage Regulator
The primary application of a Zener diode is as a voltage regulator. In the breakdown region, the voltage across the Zener diode remains nearly constant regardless of the current flowing through it (within specified limits).
- The diode is connected in parallel with the load.
- A series resistor (Rs) is used to limit the total current.
- The Zener maintains a constant voltage Vz across the load as long as the input voltage > Vz and Zener current Iz is between Iz_min and Iz_max.
        `,
        topics: ['Zener Diode', 'Zener Breakdown', 'Avalanche Breakdown', 'Voltage Regulator'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'Zener breakdown happens in heavily doped diodes (<6V); Avalanche in lightly doped (>6V).',
          'Zener diodes are operated in reverse bias for voltage regulation.',
          'Voltage across Zener is constant in the breakdown region.'
        ],
        questions2Mark: [
          'Differentiate between Zener and Avalanche breakdown.',
          'Why is a series resistor required in a Zener voltage regulator?'
        ],
        questions5Mark: [
          'Explain the operation of a Zener diode as a voltage regulator with a circuit diagram.'
        ],
        questions10Mark: [
          'Design a Zener voltage regulator to maintain a constant output voltage and explain how it handles variations in input voltage and load current.'
        ],
        mcqs: [
          {
            question: 'The temperature coefficient of a diode exhibiting Zener breakdown (below 5V) is usually:',
            options: ['Positive', 'Negative', 'Zero', 'Infinite'],
            correctAnswer: 'Negative',
            explanation: 'Zener breakdown has a negative temperature coefficient, meaning the breakdown voltage decreases as temperature increases. Avalanche breakdown has a positive coefficient.'
          }
        ]
      },
      {
        chapterNumber: 5,
        title: 'BJT Fundamentals',
        shortDescription: 'Bipolar Junction Transistor construction, operation, and configurations.',
        content: `
# BJT Fundamentals

The Bipolar Junction Transistor (BJT) is a three-terminal semiconductor device consisting of two back-to-back PN junctions. It is a current-controlled device.

## Construction
1. **Emitter (E):** Heavily doped, emits charge carriers.
2. **Base (B):** Very thin and lightly doped, passes most carriers from emitter to collector.
3. **Collector (C):** Moderately doped, largest area, collects charge carriers.
Types: NPN and PNP.

## Operating Regions
1. **Active Region:** Emitter-Base (EB) junction is forward-biased, Collector-Base (CB) junction is reverse-biased. Used for amplification.
2. **Saturation Region:** Both EB and CB junctions are forward-biased. Acts as a closed switch.
3. **Cut-off Region:** Both EB and CB junctions are reverse-biased. Acts as an open switch.

## Configurations
1. **Common Base (CB):** Current gain (α) < 1. High voltage gain.
2. **Common Emitter (CE):** Current gain (β) is high (typically 50-300). High voltage and power gain. Most widely used.
3. **Common Collector (CC):** Current gain (γ) is high. Voltage gain ≈ 1. High input impedance, low output impedance. Used as a voltage buffer (emitter follower).

## Relationship between α, β, and γ
- α = Ic / Ie
- β = Ic / Ib
- β = α / (1 - α)
- α = β / (1 + β)
- Ie = Ib + Ic
        `,
        topics: ['BJT', 'NPN', 'PNP', 'Active Region', 'CE Configuration'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'BJT is a current-controlled device.',
          'Active region: EB forward, CB reverse.',
          'CE configuration provides both voltage and current gain.',
          'β = α / (1 - α)'
        ],
        questions2Mark: [
          'What are the three operating regions of a BJT?',
          'Establish the relation between alpha (α) and beta (β).'
        ],
        questions5Mark: [
          'Explain the input and output characteristics of a BJT in Common Emitter (CE) configuration.'
        ],
        questions10Mark: [
          'Describe the operation of an NPN transistor in the active region. Draw the energy band diagram and explain the current components.'
        ],
        mcqs: [
          {
            question: 'Which region of the BJT is the most heavily doped?',
            options: ['Emitter', 'Base', 'Collector', 'They are equally doped'],
            correctAnswer: 'Emitter',
            explanation: 'The emitter is the most heavily doped region to inject a large number of charge carriers into the base.'
          }
        ]
      },
      {
        chapterNumber: 6,
        title: 'BJT Biasing',
        shortDescription: 'DC load line, operating point (Q-point), and biasing techniques.',
        content: `
# BJT Biasing

Biasing refers to applying external DC voltages to establish a desired quiescent operating point (Q-point) in the active region for linear amplification.

## DC Load Line and Q-Point
- **DC Load Line:** A straight line drawn on the output characteristics representing all possible DC operating points for a given circuit. It connects the cutoff point (Vce = Vcc, Ic = 0) and the saturation point (Vce = 0, Ic = Vcc/Rc).
- **Q-Point:** The specific point on the load line where the transistor operates when no AC signal is applied. For an ideal amplifier, the Q-point is exactly in the middle of the active region.

## Need for Biasing Stability
The Q-point can shift due to temperature variations (affecting reverse saturation current Ico, Vbe, and β) and variations in β among transistors of the same type. Thermal runaway can occur if Ico increases unchecked, ultimately destroying the BJT.

## Biasing Circuits
1. **Fixed Bias:** Simple but extremely unstable. Q-point heavily depends on β.
2. **Collector-to-Base Bias:** Provides some negative feedback, improving stability over fixed bias.
3. **Voltage Divider Bias (Self-Bias):** The most widely used biasing circuit. The base voltage is established by a resistor voltage divider. If the emitter resistor (Re) is appropriately chosen, the Q-point becomes virtually independent of β.
   - Stability factor (S) is lowest (best) for voltage divider bias.
        `,
        topics: ['DC Load Line', 'Q-Point', 'Thermal Runaway', 'Voltage Divider Bias'],
        difficulty: 'Hard',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'Q-point should be in the center of the active region for maximum undistorted swing.',
          'Thermal runaway is the self-destruction of a BJT due to cumulative heat increase.',
          'Voltage divider bias is the most stable and widely used biasing method.'
        ],
        questions2Mark: [
          'What is thermal runaway in a BJT?',
          'Define stability factor (S).'
        ],
        questions5Mark: [
          'Draw the circuit diagram of a voltage divider bias and derive the expression for base voltage (Vb).'
        ],
        questions10Mark: [
          'Explain the concept of DC load line. Discuss why voltage divider bias is preferred over fixed bias with mathematical justification for stability.'
        ],
        mcqs: [
          {
            question: 'The most stable biasing technique for a BJT is:',
            options: ['Fixed bias', 'Collector-to-base bias', 'Voltage divider bias', 'Emitter bias'],
            correctAnswer: 'Voltage divider bias',
            explanation: 'Voltage divider bias makes the operating point largely independent of the transistor\'s beta (current gain), providing the highest thermal stability.'
          }
        ]
      },
      {
        chapterNumber: 7,
        title: 'BJT Amplifiers',
        shortDescription: 'Small-signal analysis, h-parameters, and amplifier characteristics.',
        content: `
# BJT Amplifiers

An amplifier increases the amplitude of a weak AC signal. For analysis, we use small-signal AC equivalent circuits.

## Small-Signal AC Models
To analyze a BJT amplifier, we replace the DC sources with short circuits and use a small-signal model for the transistor.
1. **re Model:** Uses diode equivalent resistance (re = 26mV / Ie).
2. **Hybrid (h) Parameter Model:** Represents the BJT as a two-port network. The four h-parameters are:
   - hie (input impedance)
   - hre (reverse voltage ratio)
   - hfe (forward current gain, AC β)
   - hoe (output admittance)

## Common Emitter (CE) Amplifier
- Provides high voltage gain (Av).
- Provides high current gain (Ai).
- Phase inversion (180° shift) between input and output.
- Input and output impedances are moderate.

## Common Collector (CC) Amplifier (Emitter Follower)
- Voltage gain (Av) ≈ 1.
- High current gain (Ai).
- No phase inversion (0° shift).
- Very high input impedance and very low output impedance.
- Primarily used for impedance matching.

## Bypass and Coupling Capacitors
- **Coupling Capacitors:** Block DC from entering or leaving the amplifier while allowing AC to pass.
- **Emitter Bypass Capacitor (Ce):** Placed in parallel with Re. It acts as an AC short circuit, preventing negative feedback in the emitter leg, thereby maximizing AC voltage gain.
        `,
        topics: ['Small-Signal Model', 'h-Parameters', 'CE Amplifier', 'Emitter Follower'],
        difficulty: 'Hard',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'CE amplifier provides a 180° phase shift.',
          'CC amplifier (emitter follower) is used for impedance matching (high Zin, low Zout).',
          'Bypass capacitor increases AC voltage gain by shorting the emitter resistor.'
        ],
        questions2Mark: [
          'Why is the Common Collector amplifier called an Emitter Follower?',
          'What is the purpose of the emitter bypass capacitor?'
        ],
        questions5Mark: [
          'Draw the h-parameter equivalent circuit of a BJT in CE configuration.'
        ],
        questions10Mark: [
          'Derive the expressions for voltage gain, current gain, input impedance, and output impedance of a CE amplifier using the exact h-parameter model.'
        ],
        mcqs: [
          {
            question: 'Which BJT configuration introduces a 180° phase shift between input and output?',
            options: ['Common Base', 'Common Emitter', 'Common Collector', 'None of the above'],
            correctAnswer: 'Common Emitter',
            explanation: 'In a CE amplifier, as the base voltage increases, collector current increases, causing a larger voltage drop across the collector resistor, which lowers the collector (output) voltage, resulting in a 180° phase inversion.'
          }
        ]
      },
      {
        chapterNumber: 8,
        title: 'FET and MOSFET',
        shortDescription: 'Field Effect Transistors, JFETs, and MOSFETs construction and working.',
        content: `
# FET and MOSFET

Field Effect Transistors (FETs) are voltage-controlled unipolar devices. Only one type of charge carrier (electrons or holes) participates in conduction. They offer extremely high input impedance.

## Junction Field Effect Transistor (JFET)
- **Construction:** A narrow channel of N-type or P-type material flanked by regions of the opposite type (Gate).
- **Operation:** Reverse biasing the Gate-Source junction increases the depletion region width, pinching off the channel and restricting Drain-Source current (Id).
- **Characteristics:** It is a depletion-mode only device. Maximum current (Idss) flows when Vgs = 0V.

## Metal-Oxide-Semiconductor FET (MOSFET)
MOSFETs have a silicon dioxide (SiO2) insulating layer between the metallic gate and the semiconductor channel, giving them near-infinite DC input impedance.

### 1. Depletion-Type MOSFET (D-MOSFET)
- Has a physical channel built-in.
- Can operate in both Depletion mode (negative Vgs for N-channel) and Enhancement mode (positive Vgs).

### 2. Enhancement-Type MOSFET (E-MOSFET)
- No built-in channel. A channel must be induced by applying a Gate-Source voltage greater than a threshold value (Vth).
- **Operation (N-channel):** Positive Vgs attracts electrons to the oxide interface, creating an inversion layer (the N-channel) connecting the drain and source.
- Most widely used device in modern digital ICs and VLSI.
        `,
        topics: ['FET', 'JFET', 'MOSFET', 'Enhancement Mode', 'Depletion Mode'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'BJT is current-controlled; FET is voltage-controlled.',
          'FET has very high input impedance compared to BJT.',
          'E-MOSFET requires Vgs > Vth to turn on; it has no physical channel initially.'
        ],
        questions2Mark: [
          'Differentiate between BJT and FET.',
          'What is the threshold voltage (Vth) of an E-MOSFET?'
        ],
        questions5Mark: [
          'Explain the construction and working principle of an N-channel JFET.'
        ],
        questions10Mark: [
          'Describe the operation of an N-channel Enhancement MOSFET. Draw and explain its drain and transfer characteristics.'
        ],
        mcqs: [
          {
            question: 'An Enhancement-type MOSFET operates only when:',
            options: ['Vgs is zero', 'Vgs is less than the threshold voltage', 'Vgs is greater than the threshold voltage', 'Vds is zero'],
            correctAnswer: 'Vgs is greater than the threshold voltage',
            explanation: 'An E-MOSFET has no physical channel. A gate voltage exceeding the threshold voltage is required to invert the substrate surface and create a conducting channel.'
          }
        ]
      },
      {
        chapterNumber: 9,
        title: 'FET Amplifiers',
        shortDescription: 'Biasing FETs, small-signal models, and amplifier configurations.',
        content: `
# FET Amplifiers

Like BJTs, FETs can be biased in their active (saturation) region to act as linear amplifiers. Because of their high input impedance, FET amplifiers load the preceding stage much less than BJT amplifiers.

## Small-Signal Model
For small AC signals, the FET is modeled as a voltage-controlled current source.
- **Transconductance (gm):** The key parameter relating output current change to input voltage change. gm = ΔId / ΔVgs.
- **Drain resistance (rd):** Internal output resistance of the FET.
- Input impedance is considered practically infinite (open circuit).

## Biasing Configurations
1. **Fixed Bias:** Uses two separate DC voltage sources (Vgg and Vdd). Not practical.
2. **Self-Bias:** Uses a source resistor (Rs). The voltage drop across Rs provides the necessary negative Vgs for a JFET or D-MOSFET.
3. **Voltage-Divider Bias:** Similar to BJT, but drawing zero gate current.

## Common Source (CS) Amplifier
- Analogous to the CE amplifier in BJTs.
- Provides high voltage gain.
- Introduces a 180° phase inversion between input and output.
- Input impedance is extremely high (determined entirely by biasing resistors).

## Common Drain (CD) Amplifier (Source Follower)
- Analogous to the CC (Emitter Follower) amplifier.
- Voltage gain ≈ 1.
- No phase inversion.
- Extremely high input impedance and low output impedance. Used for impedance matching.
        `,
        topics: ['Transconductance', 'Self-Bias', 'Common Source Amplifier', 'Source Follower'],
        difficulty: 'Hard',
        examImportance: 'Medium',
        isPublic: true,
        quickRevision: [
          'Transconductance (gm) is the key AC parameter for FETs.',
          'Common Source amplifier causes a 180° phase shift.',
          'Common Drain (Source Follower) has voltage gain near 1 and is used as a buffer.'
        ],
        questions2Mark: [
          'Define transconductance (gm) of a FET.',
          'What is a Source Follower?'
        ],
        questions5Mark: [
          'Draw the small-signal AC equivalent circuit of a JFET.'
        ],
        questions10Mark: [
          'Analyze a Common Source JFET amplifier with self-bias to find its voltage gain, input impedance, and output impedance.'
        ],
        mcqs: [
          {
            question: 'The voltage gain of a Common Drain (Source Follower) amplifier is typically:',
            options: ['Very high', 'Negative', 'Slightly less than unity (1)', 'Exactly zero'],
            correctAnswer: 'Slightly less than unity (1)',
            explanation: 'The Source Follower has a voltage gain that approaches, but never exceeds, 1. Its primary use is impedance matching, not voltage amplification.'
          }
        ]
      },
      {
        chapterNumber: 10,
        title: 'Feedback Amplifiers',
        shortDescription: 'Concept of feedback, topologies, and effects of negative feedback.',
        content: `
# Feedback Amplifiers

Feedback is the process of taking a portion of the output signal and returning it to the input.

## Types of Feedback
1. **Positive (Regenerative) Feedback:** The feedback signal is in phase with the input signal. It increases the overall gain but can lead to instability and oscillations.
2. **Negative (Degenerative) Feedback:** The feedback signal is 180° out of phase with the input signal. It decreases the overall gain but vastly improves amplifier performance.

## Effects of Negative Feedback
While negative feedback reduces the overall voltage gain (Af = A / (1 + Aβ)), it provides several critical advantages:
- **Stabilizes Gain:** Gain becomes practically independent of internal transistor variations.
- **Reduces Non-linear Distortion:** Improves signal fidelity.
- **Increases Bandwidth:** The gain-bandwidth product remains constant, so reducing gain increases bandwidth.
- **Modifies Impedances:** Depending on the topology, it can increase input impedance and decrease output impedance.

## Four Feedback Topologies
1. **Voltage-Series:** Samples output voltage, mixes in series (Voltage amplifier). Increases Zin, decreases Zout.
2. **Voltage-Shunt:** Samples output voltage, mixes in parallel (Transresistance amplifier). Decreases Zin, decreases Zout.
3. **Current-Series:** Samples output current, mixes in series (Transconductance amplifier). Increases Zin, increases Zout.
4. **Current-Shunt:** Samples output current, mixes in parallel (Current amplifier). Decreases Zin, increases Zout.
        `,
        topics: ['Negative Feedback', 'Gain Stability', 'Feedback Topologies', 'Bandwidth'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'Negative feedback reduces gain but improves stability, bandwidth, and distortion.',
          'Gain with feedback: Af = A / (1 + Aβ).',
          'Voltage-Series feedback increases input impedance and decreases output impedance.'
        ],
        questions2Mark: [
          'State two advantages of negative feedback.',
          'What is the formula for gain with negative feedback?'
        ],
        questions5Mark: [
          'Explain how negative feedback increases the bandwidth of an amplifier.'
        ],
        questions10Mark: [
          'List and explain the four basic feedback topologies. How do they affect input and output impedances?'
        ],
        mcqs: [
          {
            question: 'What is the effect of voltage-series negative feedback on input and output impedances?',
            options: ['Increases both', 'Decreases both', 'Increases Zin, decreases Zout', 'Decreases Zin, increases Zout'],
            correctAnswer: 'Increases Zin, decreases Zout',
            explanation: 'Voltage sampling (shunt connection at output) decreases Zout. Series mixing at the input increases Zin. This approaches the ideal characteristics of a voltage amplifier.'
          }
        ]
      },
      {
        chapterNumber: 11,
        title: 'Oscillators',
        shortDescription: 'Barkhausen criterion, LC oscillators, RC oscillators, and crystal oscillators.',
        content: `
# Oscillators

An oscillator is an electronic circuit that generates a periodic oscillating signal (usually sine, square, or triangle) without any external AC input signal. It uses a DC power supply and positive feedback.

## Barkhausen Criterion
For a feedback circuit to sustain continuous oscillations, two conditions must be met simultaneously:
1. **Loop Gain Magnitude:** The magnitude of the loop gain must be exactly equal to 1 (|Aβ| = 1).
2. **Phase Shift:** The total phase shift around the feedback loop must be 0° or 360°.

## Types of Oscillators
1. **RC Oscillators (Low Frequencies - Audio):**
   - **RC Phase Shift Oscillator:** Uses three RC stages (each providing 60° shift) + an inverting amplifier (180° shift) to achieve a total 360° shift.
   - **Wien Bridge Oscillator:** Uses a lead-lag network. Provides exactly 0° phase shift at the resonant frequency. Extremely pure sine wave output.
2. **LC Oscillators (High Frequencies - RF):**
   - **Hartley Oscillator:** Uses a tapped inductor (two inductors) and one capacitor in the tank circuit.
   - **Colpitts Oscillator:** Uses a tapped capacitor (two capacitors) and one inductor in the tank circuit.
3. **Crystal Oscillators:**
   - Uses a piezoelectric quartz crystal.
   - Provides extraordinarily high frequency stability and Q-factor. Used in digital clocks, microcontrollers, and radios.
        `,
        topics: ['Barkhausen Criterion', 'RC Oscillators', 'LC Oscillators', 'Crystal Oscillators'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'Barkhausen criterion: |Aβ| = 1 and phase shift = 0° or 360°.',
          'RC phase shift oscillator needs three RC sections for a 180° shift.',
          'Colpitts uses tapped capacitors; Hartley uses a tapped inductor.',
          'Crystal oscillators use the piezoelectric effect for extreme frequency stability.'
        ],
        questions2Mark: [
          'State the Barkhausen criterion.',
          'What is the piezoelectric effect?'
        ],
        questions5Mark: [
          'Explain the working principle of a Wien Bridge oscillator.'
        ],
        questions10Mark: [
          'Draw the circuit diagram of an RC phase shift oscillator using a BJT and explain its operation. What is the frequency of oscillation?'
        ],
        mcqs: [
          {
            question: 'Which of the following oscillators is known for providing the highest frequency stability?',
            options: ['Hartley Oscillator', 'Colpitts Oscillator', 'Wien Bridge Oscillator', 'Crystal Oscillator'],
            correctAnswer: 'Crystal Oscillator',
            explanation: 'Crystal oscillators utilize the piezoelectric resonance of a quartz crystal, which has an extremely high Q-factor, making the oscillation frequency highly stable against temperature and voltage variations.'
          }
        ]
      },
      {
        chapterNumber: 12,
        title: 'Operational Amplifiers',
        shortDescription: 'Ideal Op-Amp characteristics, inverting/non-inverting amps, and applications.',
        content: `
# Operational Amplifiers (Op-Amps)

An Operational Amplifier (Op-Amp) is a highly stable, high-gain, DC-coupled differential amplifier integrated circuit. The standard IC is the 741.

## Characteristics of an Ideal Op-Amp
- Infinite open-loop voltage gain (A = ∞)
- Infinite input impedance (Zin = ∞), meaning it draws zero input current.
- Zero output impedance (Zout = 0)
- Infinite bandwidth (flat frequency response)
- Infinite Common Mode Rejection Ratio (CMRR = ∞)

## Virtual Ground / Virtual Short Concept
In a closed-loop configuration with negative feedback, the high gain of the Op-Amp forces the voltage difference between the inverting (-) and non-inverting (+) input terminals to be zero (V+ = V-). If V+ is grounded, V- is at a "virtual ground".

## Basic Configurations
1. **Inverting Amplifier:** Input is applied to the inverting terminal. 
   - Gain (Av) = -Rf / R1
2. **Non-Inverting Amplifier:** Input is applied to the non-inverting terminal.
   - Gain (Av) = 1 + (Rf / R1)
3. **Voltage Follower (Buffer):** Output is directly tied to the inverting input. 
   - Gain = 1. Used for impedance matching.

## Op-Amp Applications
- **Adder/Summer:** Adds multiple input voltages.
- **Subtractor (Difference Amplifier):** Amplifies the difference between two voltages.
- **Integrator:** Uses a capacitor in the feedback loop. Converts a square wave to a triangle wave.
- **Differentiator:** Uses a capacitor at the input. Converts a triangle wave to a square wave.
- **Comparators & Schmitt Triggers:** Uses positive or no feedback for switching applications.
        `,
        topics: ['Op-Amp Characteristics', 'Virtual Ground', 'Inverting Amplifier', 'Op-Amp Applications'],
        difficulty: 'Medium',
        examImportance: 'High',
        isPublic: true,
        quickRevision: [
          'Ideal Op-Amp has infinite gain, infinite Zin, zero Zout, and infinite CMRR.',
          'Virtual ground concept assumes V+ = V- in negative feedback circuits.',
          'Inverting amplifier gain = -Rf/R1.',
          'Voltage follower has a gain of 1 and infinite input impedance.'
        ],
        questions2Mark: [
          'List four characteristics of an ideal operational amplifier.',
          'Explain the concept of virtual ground.'
        ],
        questions5Mark: [
          'Derive the voltage gain expression for a non-inverting Op-Amp amplifier.'
        ],
        questions10Mark: [
          'Draw and explain the circuits for an Op-Amp acting as an Integrator and a Differentiator. Provide input and output waveforms for a square wave input.'
        ],
        mcqs: [
          {
            question: 'The voltage gain of an ideal voltage follower (Op-Amp buffer) is:',
            options: ['Infinity', 'Zero', 'One', 'Depends on feedback resistor'],
            correctAnswer: 'One',
            explanation: 'A voltage follower has a direct short from output to the inverting input (Rf = 0). Since Av = 1 + (0/R1), the gain is exactly 1.'
          }
        ]
      }
    ];

    console.log(`Found Subject: ${subject.name} (${subject._id})`);
    console.log('Seeding Analog Electronics notes...');

    for (const chapter of chapters) {
      await Note.findOneAndUpdate(
        { subject: subject._id, chapterNumber: chapter.chapterNumber },
        {
          ...chapter,
          subject: subject._id,
          author: admin._id
        },
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded Chapter ${chapter.chapterNumber}: ${chapter.title}`);
    }

    console.log('🎉 Successfully seeded Analog Electronics study notes.');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Error seeding notes:', error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  seedAnalogElectronics();
}

module.exports = seedAnalogElectronics;
