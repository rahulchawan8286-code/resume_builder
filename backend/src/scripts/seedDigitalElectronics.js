require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const User = require('../models/User');

const seedDigitalElectronics = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
    }
    console.log('Connected.');

    let user = await User.findOne({ role: 'Admin' });
    if (!user) {
      user = await User.findOne({});
      if (!user) {
        console.log('No user found to assign as author. Creating dummy admin...');
        user = await User.create({
          name: 'System Admin',
          email: 'admin@careercompass.test',
          password: 'password123',
          role: 'Admin'
        });
      }
    }

    let subject = await Subject.findOne({ code: 'ECE-DE' });
    if (!subject) {
      subject = await Subject.findOne({ name: 'Digital Electronics' });
    }
    
    if (!subject) {
      subject = await Subject.create({
        name: 'Digital Electronics',
        description: 'Study of digital signals, logic gates, Boolean algebra, and circuits.',
        code: 'ECE-DE',
        isActive: true
      });
    } else if (!subject.code || subject.code !== 'ECE-DE') {
      subject.code = 'ECE-DE';
      await subject.save();
    }

    // Clear existing notes to prevent duplicates or legacy titles
    await Note.deleteMany({ subject: subject._id });

    const chaptersData = [
      {
        title: '1. Number Systems and Codes',
        content: `
# Number Systems and Codes

## Introduction
Digital systems operate on binary data. Understanding number systems is the first step in digital electronics.

## Decimal, Binary, Octal, and Hexadecimal
- **Decimal (Base 10):** 0-9
- **Binary (Base 2):** 0-1. Used internally by digital circuits.
- **Octal (Base 8):** 0-7. Used for compact binary representation (groups of 3 bits).
- **Hexadecimal (Base 16):** 0-9, A-F. Widely used in microprocessors and memory addressing (groups of 4 bits).

## Number Base Conversions
Conversion from decimal to any base involves repeated division. Conversion to decimal involves positional weights.
Example: 
Binary \`1011_2\` = \`1*(2^3) + 0*(2^2) + 1*(2^1) + 1*(2^0)\` = \`11_10\`

## Binary Codes
- **BCD (Binary Coded Decimal):** Each decimal digit is represented by 4 bits.
- **Gray Code:** Only one bit changes state from one position to the next. Excellent for reducing errors in electro-mechanical switches.
- **ASCII Code:** 7-bit code used for text representation.

## Complements
- **1's Complement:** Invert all bits.
- **2's Complement:** Add 1 to the 1's complement. This is the standard mechanism for representing negative numbers in digital systems because it allows subtraction to be performed by an adder circuit.

**Exam Tip:** Always check if a number is signed or unsigned before evaluating its decimal equivalent!
        `
      },
      {
        title: '2. Boolean Algebra and Logic Gates',
        content: `
# Boolean Algebra and Logic Gates

## Boolean Algebra
Boolean algebra forms the mathematical foundation of digital logic design.

### Key Laws and Theorems
- **Commutative Law:** \`A + B = B + A\`
- **Associative Law:** \`A(BC) = (AB)C\`
- **Distributive Law:** \`A(B + C) = AB + AC\`
- **Idempotent Law:** \`A + A = A\`
- **Involution Law:** \`(A')' = A\`

### De Morgan's Theorems
Extremely important for converting AND logic to OR logic and vice versa.
1. \`(A + B)' = A' * B'\` (NOR = Bubbled AND)
2. \`(A * B)' = A' + B'\` (NAND = Bubbled OR)

## Logic Gates
- **Basic Gates:** AND, OR, NOT.
- **Universal Gates:** NAND, NOR. They are "universal" because any Boolean function can be implemented using only NAND gates or only NOR gates.
- **Special Gates:** XOR (Exclusive-OR), XNOR. 
  - XOR output is 1 if inputs are different.
  - XNOR output is 1 if inputs are the same.

## Applications
Logic gates are used in all digital ICs, microprocessors, and memory chips.

**Exam Tip:** Be prepared to draw the transistor-level (CMOS) implementation of a NAND or NOR gate.
        `
      },
      {
        title: '3. Boolean Function Simplification',
        content: `
# Boolean Function Simplification

Simplifying Boolean functions reduces the number of logic gates needed, leading to faster, cheaper, and more power-efficient circuits.

## Canonical and Standard Forms
- **Sum of Products (SOP):** \`F = AB + A'C\`. Corresponds to the "1s" in a truth table. Uses Minterms (Σm).
- **Product of Sums (POS):** \`F = (A+B)(A'+C)\`. Corresponds to the "0s" in a truth table. Uses Maxterms (ΠM).

## Karnaugh Maps (K-Maps)
A visual method for simplifying Boolean expressions up to 4 or 5 variables.

### K-Map Rules:
1. Squares are arranged in Gray Code order (only one bit changes between adjacent squares).
2. Group adjacent 1s in powers of 2 (1, 2, 4, 8, 16).
3. Overlapping and edge-wrapping are allowed.
4. The goal is to make the fewest number of groups with the largest possible size.

## Don't Care Conditions (X)
In some digital systems, certain input combinations will never occur. The output for these states is considered a "Don't Care" (X).
We can choose to include an 'X' in a K-map group if it helps make a larger group (simplifying the expression further), or ignore it if it doesn't help.

## Quine-McCluskey Method
For more than 5 variables, K-Maps become unwieldy. The tabular Quine-McCluskey method is used instead and is easily programmable into software algorithms.
        `
      },
      {
        title: '4. Combinational Logic Circuits',
        content: `
# Combinational Logic Circuits

In combinational logic, the output at any instant depends ONLY on the current input values. There is no memory or feedback loop.

## Arithmetic Circuits
- **Half Adder:** Adds two 1-bit inputs. Outputs Sum (XOR) and Carry (AND).
- **Full Adder:** Adds two 1-bit inputs plus a Carry-In. Outputs Sum and Carry-Out.
  - \`Sum = A ⊕ B ⊕ Cin\`
  - \`Cout = AB + Cin(A ⊕ B)\`
- **Parallel Adder / Ripple Carry Adder:** Cascades multiple full adders to add N-bit numbers. The carry "ripples" through, which creates a propagation delay.
- **Look-Ahead Carry Adder:** Solves the ripple delay by calculating the carry bits in parallel using complex combinational logic.

## Multiplexers (MUX)
A MUX selects one of \`2^n\` input lines and routes it to a single output line based on \`n\` select lines.
- Often called a "Data Selector".
- A MUX can be used to implement ANY Boolean function by tying the data inputs to Vcc or Gnd.

## Demultiplexers and Decoders
- **Demultiplexer (DEMUX):** Routes a single input to one of \`2^n\` output lines.
- **Decoder:** Converts an N-bit binary input into \`2^n\` unique output lines. Frequently used for memory address decoding.

## Encoders
Converts an active input signal into a coded output (e.g., 8-to-3 encoder). Priority encoders handle cases where multiple inputs are active simultaneously by giving priority to the highest-order input.
        `
      },
      {
        title: '5. Sequential Logic Circuits',
        content: `
# Sequential Logic Circuits

Unlike combinational circuits, sequential circuits have **memory**. The output depends on the current inputs AND the previous state of the circuit.

## Key Concepts
- **Clock:** A periodic square wave signal used to synchronize the state changes in a sequential circuit.
- **State:** The current binary values stored in the memory elements.

## Latches vs Flip-Flops
- **Latches:** Level-sensitive. The output can change continuously as long as the enable signal is asserted.
- **Flip-Flops:** Edge-triggered. The output only changes at the exact moment the clock transitions from 0-to-1 (Rising Edge) or 1-to-0 (Falling Edge).

## Setup and Hold Times
- **Setup Time (ts):** The minimum time the data input must be stable BEFORE the clock edge arrives.
- **Hold Time (th):** The minimum time the data input must remain stable AFTER the clock edge has occurred.
- Violating these times leads to **metastability**, where the output hovers between 0 and 1 unpredictably.

## Applications
Sequential circuits form the basis for counters, registers, state machines, and all microprocessor memory architecture.
        `
      },
      {
        title: '6. Flip-Flops',
        content: `
# Flip-Flops

Flip-flops are the fundamental 1-bit memory elements in sequential circuits.

## SR Flip-Flop (Set-Reset)
- **S=1, R=0:** Sets Q to 1.
- **S=0, R=1:** Resets Q to 0.
- **S=0, R=0:** Holds previous state.
- **S=1, R=1:** Invalid/Forbidden state (race condition).

## JK Flip-Flop
Improves upon the SR flip-flop by resolving the invalid state.
- **J=1, K=1:** Toggles the output (Q becomes Q').
- **Race Around Condition:** In level-triggered JK latches, if J=K=1 and the clock pulse is too long, the output toggles multiple times unpredictably. Solved by using edge-triggering or a Master-Slave configuration.

## D Flip-Flop (Data)
The output Q simply follows the input D at the clock edge. 
- It acts as a basic delay or 1-bit storage cell.
- Heavily used in shift registers and microprocessor data paths.

## T Flip-Flop (Toggle)
- **T=0:** Holds state.
- **T=1:** Toggles state on every clock edge.
- Very useful for designing binary counters because toggling is the basis of counting.

**Excitation Tables:** While a truth table gives the next state based on current inputs, an excitation table gives the required inputs to achieve a specific state transition.
        `
      },
      {
        title: '7. Registers and Shift Registers',
        content: `
# Registers and Shift Registers

A **register** is a group of flip-flops connected together to store multiple bits of data. An N-bit register uses N flip-flops.

## Shift Registers
A shift register allows the stored data to be shifted left or right by one bit position on every clock pulse.

### Types of Shift Registers
1. **SISO (Serial-In, Serial-Out):** Data is shifted in one bit at a time and exits one bit at a time. Used to create digital time delays.
2. **SIPO (Serial-In, Parallel-Out):** Data is shifted in serially, but all bits can be read simultaneously. Used for serial-to-parallel conversion.
3. **PISO (Parallel-In, Serial-Out):** All bits are loaded at once, then shifted out serially. Used in transmitters (like UART) to send parallel data over a single wire.
4. **PIPO (Parallel-In, Parallel-Out):** Simply stores data. Loads and reads all bits at once. (Effectively a standard register).

## Universal Shift Register
A bidirectional register that can operate in all four modes (SISO, SIPO, PISO, PIPO) depending on multiplexed control signals.

## Applications
- Data format conversion (Serial/Parallel).
- Arithmetic operations (Shifting left by 1 bit multiplies the binary number by 2; shifting right divides by 2).
- PRBS (Pseudo-Random Binary Sequence) generation.
        `
      },
      {
        title: '8. Counters',
        content: `
# Counters

A counter is a sequential circuit that proceeds through a predetermined sequence of states upon the application of clock pulses.

## Asynchronous (Ripple) Counters
The clock signal is only applied to the first flip-flop. The output of one flip-flop acts as the clock for the next.
- **Advantage:** Simple design, fewer logic gates.
- **Disadvantage:** The propagation delay accumulates as the signal ripples down the chain. If the clock is too fast, the counter will fail. Causes "glitches" in decoding logic.

## Synchronous Counters
The same master clock signal is applied simultaneously to ALL flip-flops.
- **Advantage:** Very fast, no accumulated ripple delay. Safe to decode.
- **Disadvantage:** Requires more complex combinational logic (AND gates) to determine the next state for the J-K or T inputs.

## Specialized Counters
- **Modulus (Mod-N) Counter:** A counter that resets back to zero after reaching N states. A standard 4-bit counter is Mod-16. A BCD decade counter is a Mod-10 counter (counts 0 to 9, then resets).
- **Ring Counter:** A shift register where the output of the last FF is connected to the input of the first. A single '1' circulates through the register.
- **Johnson Counter (Twisted Ring):** The inverted output of the last FF is fed back to the first. Produces a specific sequence of overlapping 1s and 0s.

## Counter Design
Synchronous counters are designed using a state diagram, state table, excitation tables for the chosen flip-flops, and K-maps to derive the combinational logic.
        `
      },
      {
        title: '9. Memories and Programmable Logic Devices',
        content: `
# Memories and Programmable Logic Devices

## Memory Classification
Memory is broadly classified into Volatile (loses data without power) and Non-Volatile (retains data without power).

### RAM (Volatile)
- **SRAM (Static RAM):** Built using cross-coupled inverters (flip-flops). Very fast, but takes up more silicon area (6 transistors per cell). Used for CPU Cache.
- **DRAM (Dynamic RAM):** Built using a single transistor and a capacitor. The capacitor leaks charge, so it must be periodically refreshed. Slower, but extremely dense and cheap. Used for Main System Memory.

### ROM (Non-Volatile)
- **Mask ROM:** Data is permanently etched into the silicon during manufacturing.
- **PROM:** Programmable once by blowing internal fuses.
- **EPROM:** Erasable using UV light.
- **EEPROM / Flash:** Electrically erasable. Flash is a block-erasable EEPROM, used heavily in SSDs and USB drives.

## Programmable Logic Devices (PLDs)
Standard ICs have fixed logic. PLDs allow the hardware logic to be configured by the user.

- **PLA (Programmable Logic Array):** Both the AND array and OR array are programmable. Highly flexible but slower.
- **PAL (Programmable Array Logic):** Programmable AND array, but a fixed OR array. Faster and cheaper than PLA.
- **FPGA (Field Programmable Gate Array):** Contains thousands of Configurable Logic Blocks (CLBs), programmable interconnects, and I/O blocks. FPGAs can implement massive digital systems, including entire custom microprocessors.
        `
      },
      {
        title: '10. Analog-to-Digital and Digital-to-Analog Converters',
        content: `
# ADC and DAC

Real-world signals (audio, sensors) are analog, but processors are digital. Converters bridge this gap.

## DAC (Digital-to-Analog Converter)
Converts a digital binary word into a proportional continuous analog voltage.
- **Weighted Resistor DAC:** Uses a summing op-amp with binary-weighted resistors (R, 2R, 4R, 8R). Difficult to manufacture precisely for high resolutions because the resistor values span a huge range.
- **R-2R Ladder DAC:** Uses only two resistor values (R and 2R) arranged in a ladder network. Much easier to fabricate accurately in ICs.

## ADC (Analog-to-Digital Converter)
Converts an analog voltage into a digital binary code through Sampling, Quantization, and Encoding.
- **Flash ADC:** The fastest type. Uses \`2^n - 1\` comparators in parallel. Very expensive and power-hungry for high resolutions.
- **Successive Approximation (SAR) ADC:** Uses a binary search algorithm, comparing the input to an internal DAC. Good balance of speed and complexity. Takes \`N\` clock cycles for an \`N\`-bit conversion.
- **Dual Slope ADC:** Integrates the input voltage, then discharges it at a known rate. Very slow, but highly accurate and immune to noise. Commonly used in digital multimeters.

## Nyquist Theorem
To accurately reconstruct an analog signal, it must be sampled at a frequency (\`fs\`) that is at least twice the maximum frequency component (\`fmax\`) present in the signal. 
\`fs >= 2 * fmax\`
        `
      },
      {
        title: '11. Logic Families',
        content: `
# Digital Logic Families

A logic family is a group of electronic logic gates constructed using a specific technology. Different families have different trade-offs regarding speed, power, and size.

## Key Performance Parameters
- **Propagation Delay:** The time it takes for a change at the input to produce a change at the output. Measured in nanoseconds (ns) or picoseconds (ps).
- **Power Dissipation:** The power consumed by the gate.
- **Speed-Power Product:** The product of propagation delay and power dissipation. A lower value indicates a better overall logic family.
- **Fan-in:** The number of inputs a gate has.
- **Fan-out:** The maximum number of standard inputs that the output of a gate can reliably drive.
- **Noise Margin:** The maximum noise voltage that can be superimposed on a signal without causing the gate to misinterpret a 0 as a 1, or vice versa.

## Transistor-Transistor Logic (TTL)
Built using Bipolar Junction Transistors (BJTs).
- Standardized on a 5V power supply.
- Faster than early CMOS, but consumes significantly more static power.

## Complementary Metal-Oxide-Semiconductor (CMOS)
Built using pairs of P-channel and N-channel MOSFETs.
- **Advantage:** Extremely low static power consumption. Current only flows during the brief moment when the transistors are switching states.
- **Advantage:** Very high noise margin and high fan-out.
- As clock frequencies increase, the dynamic power consumption of CMOS increases significantly due to the charging and discharging of parasitic capacitances.
- CMOS is the dominant technology in modern microprocessors and memory chips.
        `
      },
      {
        title: '12. Digital System Design Using Verilog HDL',
        content: `
# Digital System Design Using Verilog HDL

Hardware Description Languages (HDLs) allow engineers to describe digital hardware using text rather than drawing schematic diagrams. Verilog is one of the industry standards.

## Modeling Styles in Verilog
1. **Gate-Level Modeling:** Describing the circuit using built-in logic gates (and, or, not). Very low level.
2. **Dataflow Modeling:** Describing how data flows using continuous assignments (\`assign\`). Good for combinational logic.
3. **Behavioral Modeling:** Describing the algorithmic behavior using procedural blocks (\`always\`, \`initial\`). Very powerful for sequential logic.

## Basic Syntax Example: 2-to-1 MUX
\`\`\`verilog
// Dataflow modeling of a 2x1 Multiplexer
module mux2x1 (
    input a,
    input b,
    input sel,
    output y
);
    
    // Conditional operator (ternary)
    assign y = sel ? b : a;

endmodule
\`\`\`

## Sequential Logic Example: D Flip-Flop
\`\`\`verilog
// Behavioral modeling of a D Flip-Flop with asynchronous reset
module d_ff (
    input clk,
    input reset,
    input d,
    output reg q
);

    // Triggered on the rising edge of clock OR the rising edge of reset
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            q <= 1'b0; // Non-blocking assignment for sequential logic
        end else begin
            q <= d;
        end
    end

endmodule
\`\`\`

## Simulation and Synthesis
- **Simulation:** Testing the Verilog code using a Testbench to verify logical correctness before manufacturing.
- **Synthesis:** The software process of converting the abstract Verilog code into an actual physical gate-level netlist tailored for an FPGA or ASIC.
        `
      }
    ];

    for (const chapter of chaptersData) {
      await Note.create({
        title: chapter.title,
        content: chapter.content.trim(),
        subject: subject._id,
        author: user._id,
        isPublic: true
      });
    }

    console.log('✅ Successfully seeded Digital Electronics study notes.');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Error seeding notes:', error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  seedDigitalElectronics();
} else {
  module.exports = seedDigitalElectronics;
}
