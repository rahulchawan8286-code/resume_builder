require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const User = require('../models/User');

const seedCommunicationSystems = async () => {
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

    // Attempt to find the specific ID requested by the user for Communication Systems
    let subject = await Subject.findById('6a7c0f890ab3c51b218e8652');
    if (!subject) {
      subject = await Subject.findOne({ name: 'Communication Systems' });
    }
    
    if (!subject) {
      throw new Error('Subject with ID 6a7c0f890ab3c51b218e8652 not found.');
    }

    // Do NOT clear existing notes to maintain idempotency. We will use upsert.

    const chaptersData = [
      {
        chapterNumber: 1,
        title: 'Introduction to Communication Systems',
        shortDescription: 'Basic components and types of communication systems.',
        difficulty: 'Easy',
        examImportance: 'Medium',
        topics: ['Transmitter', 'Receiver', 'Channel', 'Noise'],
        importantConcepts: ['Baseband vs Passband', 'Modulation necessity'],
        formulas: ['Wavelength = c / f'],
        examples: ['Radio broadcasting', 'Television'],
        content: `
# Introduction to Communication Systems

## Overview
A communication system facilitates the reliable transmission of information from a source to a destination. The basic elements include the transmitter, communication channel, and receiver.

## Key Components
- **Transmitter:** Modifies the message signal for effective transmission.
- **Channel:** The medium over which the signal travels (e.g., free space, fiber optics).
- **Receiver:** Recovers the original message from the degraded received signal.
- **Noise:** Unwanted signals that corrupt the message during transmission.

## Why Modulation?
1. To reduce antenna size.
2. To allow multiplexing (transmitting multiple signals over the same channel).
3. To improve noise immunity.
        `,
        questions2Mark: [
          'What is modulation?',
          'List the basic elements of a communication system.'
        ],
        questions5Mark: [
          'Explain the necessity of modulation in communication systems.'
        ],
        questions10Mark: [
          'Draw the block diagram of a general communication system and explain the function of each block.'
        ],
        quickRevision: [
          'Antenna size is inversely proportional to frequency.',
          'Modulation translates low frequency to high frequency.'
        ],
        mcqs: [
          {
            question: 'The primary purpose of modulation is to:',
            options: ['Increase noise', 'Decrease bandwidth', 'Reduce antenna size', 'Decrease frequency'],
            correctAnswer: 'Reduce antenna size',
            explanation: 'High frequency transmission requires smaller antennas (L = lambda / 4).'
          }
        ]
      },
      {
        chapterNumber: 2,
        title: 'Signals and Signal Classification',
        shortDescription: 'Understanding continuous, discrete, periodic, and energy signals.',
        difficulty: 'Medium',
        examImportance: 'High',
        topics: ['Continuous vs Discrete', 'Energy vs Power Signals', 'Periodic vs Aperiodic'],
        importantConcepts: ['Unit Step', 'Unit Impulse', 'Signum Function'],
        formulas: ['Energy = Integral of |x(t)|^2 dt', 'Power = Limit (1/T) Integral |x(t)|^2 dt'],
        examples: ['A sine wave is a power signal.', 'A rectangular pulse is an energy signal.'],
        content: `
# Signals and Signal Classification

## Signal Types
- **Continuous-Time (CT):** Defined at every instant of time.
- **Discrete-Time (DT):** Defined only at discrete time intervals.
- **Periodic:** Repeats exactly after a fundamental time period (T).
- **Aperiodic:** Does not repeat.

## Energy and Power Signals
- **Energy Signal:** Has finite total energy and zero average power (e.g., a pulse).
- **Power Signal:** Has infinite energy but finite average power (e.g., a sine wave).
        `,
        questions2Mark: [
          'Define an energy signal.',
          'What is the fundamental period of sin(2πt)?'
        ],
        questions5Mark: [
          'Classify signals into energy and power signals with examples.',
          'Define Unit Impulse and Unit Step functions.'
        ],
        questions10Mark: [
          'Determine if the given signal x(t) = e^(-at)u(t) for a>0 is an energy or power signal. Calculate its value.'
        ],
        quickRevision: [
          'Energy signals: E is finite, P = 0.',
          'Power signals: P is finite, E = infinity.',
          'Periodic signals are always power signals.'
        ],
        mcqs: [
          {
            question: 'A periodic signal is generally a(n):',
            options: ['Energy signal', 'Power signal', 'Neither', 'Both'],
            correctAnswer: 'Power signal',
            explanation: 'Periodic signals exist from -infinity to +infinity and therefore have infinite energy but finite average power.'
          }
        ]
      },
      {
        chapterNumber: 3,
        title: 'Fourier Series and Fourier Transform',
        shortDescription: 'Frequency domain analysis of signals.',
        difficulty: 'Hard',
        examImportance: 'High',
        topics: ['Trigonometric Fourier Series', 'Exponential Fourier Series', 'Fourier Transform Properties'],
        importantConcepts: ['Time Scaling', 'Frequency Shifting', 'Convolution Theorem'],
        formulas: ['X(f) = Integral x(t)e^{-j2πft} dt'],
        examples: ['Fourier transform of a rectangular pulse is a sinc function.'],
        content: `
# Fourier Series and Fourier Transform

## Overview
Transforming a time-domain signal into the frequency domain allows engineers to analyze bandwidth and frequency content.

## Fourier Series
Used for periodic signals. Decomposes a periodic signal into a sum of sines and cosines (or complex exponentials).

## Fourier Transform
Used for aperiodic (and periodic via impulses) signals. 

### Key Properties
- **Linearity:** a x(t) + b y(t) <=> a X(f) + b Y(f)
- **Time Shifting:** x(t - t0) <=> X(f) e^{-j2πf t0}
- **Frequency Shifting:** x(t) e^{j2πf0 t} <=> X(f - f0)
- **Convolution in Time:** Multiplies in Frequency domain.
        `,
        questions2Mark: [
          'State the Convolution theorem.',
          'What is the Fourier transform of a unit impulse?'
        ],
        questions5Mark: [
          'Explain the duality property of Fourier Transforms.',
          'Find the Fourier Transform of a rectangular pulse.'
        ],
        questions10Mark: [
          'State and prove the Time-Scaling and Frequency-Shifting properties of the Fourier Transform.'
        ],
        quickRevision: [
          'Convolution in time = Multiplication in frequency.',
          'Rectangular pulse <=> Sinc function.',
          'Impulse in time <=> Constant in frequency.'
        ],
        mcqs: [
          {
            question: 'The Fourier transform of a unit impulse function δ(t) is:',
            options: ['0', '1', '1/f', 'sinc(f)'],
            correctAnswer: '1',
            explanation: 'The FT of a Dirac delta function at t=0 contains all frequencies equally, giving a constant value of 1.'
          }
        ]
      },
      {
        chapterNumber: 4,
        title: 'Amplitude Modulation',
        shortDescription: 'Modulating the amplitude of a high-frequency carrier.',
        difficulty: 'Medium',
        examImportance: 'High',
        topics: ['AM Theory', 'Modulation Index', 'Power Relations', 'DSB-SC', 'SSB', 'VSB'],
        importantConcepts: ['Overmodulation', 'Bandwidth efficiency'],
        formulas: ['m = Am / Ac', 'Pt = Pc (1 + m^2 / 2)', 'BW = 2fm'],
        examples: ['If m=1, sidebands carry 1/3 of total power.'],
        content: `
# Amplitude Modulation (AM)

## Introduction
In AM, the amplitude of the high-frequency carrier signal is varied in accordance with the instantaneous amplitude of the modulating (message) signal.

## Modulation Index (m)
m = Am / Ac. For undistorted AM, m must be <= 1. If m > 1, overmodulation occurs, causing envelope distortion.

## Power Relations
Total Power (Pt) = Carrier Power (Pc) + Upper Sideband Power + Lower Sideband Power.
Pt = Pc * (1 + m^2/2)

## AM Variants
- **DSB-FC (Standard AM):** Carrier + 2 Sidebands. Low power efficiency.
- **DSB-SC:** Suppressed Carrier. 100% power efficiency but complex receiver.
- **SSB:** Single Sideband. Highest bandwidth efficiency (BW = fm).
- **VSB:** Vestigial Sideband. Used in TV broadcasting.
        `,
        questions2Mark: [
          'What is modulation index in AM?',
          'What is overmodulation?'
        ],
        questions5Mark: [
          'Derive the power relation Pt = Pc(1 + m^2/2) for standard AM.',
          'Compare DSB-FC, DSB-SC, and SSB on the basis of bandwidth and power.'
        ],
        questions10Mark: [
          'An AM transmitter radiates 9 kW without modulation and 10.125 kW after modulation. Calculate the depth of modulation.'
        ],
        quickRevision: [
          'Max power efficiency of standard AM is 33.3% (at m=1).',
          'Bandwidth of AM = 2*fm, SSB = fm.',
          'Overmodulation causes phase reversal and envelope distortion.'
        ],
        mcqs: [
          {
            question: 'What is the bandwidth of an SSB signal if the message signal bandwidth is fm?',
            options: ['fm/2', 'fm', '2fm', '3fm'],
            correctAnswer: 'fm',
            explanation: 'Single Sideband transmits only one sideband, so its bandwidth is exactly equal to the message bandwidth fm.'
          }
        ]
      },
      {
        chapterNumber: 5,
        title: 'AM Modulators and Demodulators',
        shortDescription: 'Circuits used to generate and detect AM signals.',
        difficulty: 'Medium',
        examImportance: 'Medium',
        topics: ['Square Law Modulator', 'Switching Modulator', 'Envelope Detector', 'Synchronous Detector'],
        importantConcepts: ['Diagonal Clipping', 'Negative Peak Clipping', 'Costas Loop'],
        formulas: ['RC <= 1 / (wm * m)'],
        examples: ['Envelope detector for recovering baseband signal.'],
        content: `
# AM Modulators and Demodulators

## Generation of AM
- **Square Law Modulator:** Uses nonlinear devices like diodes or transistors.
- **Switching Modulator:** Uses a diode as a switch driven by a strong carrier.

## Demodulation of AM
- **Envelope Detector:** A simple diode + RC low-pass filter. Used for standard AM. The RC time constant is critical:
  - If RC is too large: Diagonal clipping occurs.
  - If RC is too small: Carrier ripple remains.
- **Synchronous (Coherent) Detector:** Multiplies the received signal by a locally generated, phase-synchronized carrier. Required for DSB-SC and SSB.
        `,
        questions2Mark: [
          'What is an envelope detector?',
          'Why is synchronous detection required for DSB-SC?'
        ],
        questions5Mark: [
          'Explain the working of an envelope detector and discuss diagonal clipping.',
          'Describe the operation of a Square Law Modulator.'
        ],
        questions10Mark: [
          'Draw the block diagram of a Costas Loop and explain how it recovers the carrier for synchronous detection.'
        ],
        quickRevision: [
          'Envelope detectors only work if a carrier is present (DSB-FC).',
          'Synchronous detection needs a local oscillator matched exactly in phase and frequency.'
        ],
        mcqs: [
          {
            question: 'Diagonal clipping in an envelope detector is caused by:',
            options: ['RC time constant too small', 'RC time constant too large', 'Overmodulation', 'Low carrier frequency'],
            correctAnswer: 'RC time constant too large',
            explanation: 'If RC is too large, the capacitor discharges too slowly to follow fast variations in the message envelope.'
          }
        ]
      },
      {
        chapterNumber: 6,
        title: 'Angle Modulation',
        shortDescription: 'Frequency Modulation (FM) and Phase Modulation (PM).',
        difficulty: 'Hard',
        examImportance: 'High',
        topics: ['FM vs PM', 'Modulation Index (beta)', 'Carson\'s Rule', 'Narrowband vs Wideband FM'],
        importantConcepts: ['Constant Envelope', 'Bessel Functions'],
        formulas: ['Beta = delta_f / fm', 'BW = 2(delta_f + fm)'],
        examples: ['Commercial FM bandwidth is approx 200 kHz.'],
        content: `
# Angle Modulation

## Introduction
In angle modulation, the amplitude of the carrier remains constant, while its frequency (FM) or phase (PM) is varied according to the message signal.

## Frequency Modulation (FM)
The instantaneous frequency varies linearly with the message signal.
- **Modulation Index (β):** β = (Frequency Deviation) / (Modulating Frequency) = Δf / fm.

## Narrowband vs Wideband FM
- **NBFM:** β < 1. Bandwidth is approx 2fm (similar to AM).
- **WBFM:** β > 1. Bandwidth is much wider, requires Bessel functions to analyze.

## Carson's Rule for Bandwidth
Approximates the bandwidth of an FM signal:
BW ≈ 2(Δf + fm) = 2(β + 1)fm
        `,
        questions2Mark: [
          'Define frequency deviation.',
          'State Carson\'s Rule.'
        ],
        questions5Mark: [
          'Compare AM and FM on the basis of bandwidth, noise immunity, and transmitted power.',
          'Differentiate between NBFM and WBFM.'
        ],
        questions10Mark: [
          'Explain the relationship between Phase Modulation (PM) and Frequency Modulation (FM). How can you generate FM using a PM modulator?'
        ],
        quickRevision: [
          'FM has a constant envelope, meaning constant transmitted power regardless of modulation index.',
          'Carson\'s rule gives 98% of the signal power bandwidth.',
          'Noise primarily affects amplitude; hence FM is highly noise immune (since amplitude is clipped at receiver).'
        ],
        mcqs: [
          {
            question: 'In FM, the modulation index depends on:',
            options: ['Message amplitude only', 'Message frequency only', 'Both message amplitude and frequency', 'Carrier frequency'],
            correctAnswer: 'Both message amplitude and frequency',
            explanation: 'β = Δf / fm. Since Δf is proportional to message amplitude Am, β depends on both Am and fm.'
          }
        ]
      },
      {
        chapterNumber: 7,
        title: 'FM Modulators and Demodulators',
        shortDescription: 'Generating and detecting FM signals.',
        difficulty: 'Medium',
        examImportance: 'Medium',
        topics: ['Direct FM', 'Indirect FM (Armstrong Method)', 'PLL Demodulator', 'Foster-Seeley Discriminator', 'Ratio Detector'],
        importantConcepts: ['VCO', 'Pre-emphasis and De-emphasis'],
        formulas: [],
        examples: ['Using a Varactor diode in an LC oscillator to generate FM.'],
        content: `
# FM Modulators and Demodulators

## Generation of FM
- **Direct Method:** The message signal directly controls a Voltage Controlled Oscillator (VCO). Common component: Varactor diode.
- **Indirect Method (Armstrong):** First generates NBFM, then uses frequency multipliers to increase the frequency deviation and carrier frequency to achieve WBFM. Highly stable.

## Demodulation of FM
FM receivers extract frequency variations.
- **Foster-Seeley Discriminator & Ratio Detector:** Convert frequency variations into amplitude variations, then use envelope detection.
- **Phase-Locked Loop (PLL):** An advanced and widely used FM demodulator. The error voltage in the PLL perfectly tracks the message signal.

## Pre-emphasis and De-emphasis
In FM, higher frequency noise is amplified. To fix this:
- **Pre-emphasis:** High-pass filter at transmitter boosts high frequencies of the message.
- **De-emphasis:** Low-pass filter at receiver restores original flat spectrum and reduces high-frequency noise.
        `,
        questions2Mark: [
          'What is the purpose of a limiter in an FM receiver?',
          'What is pre-emphasis?'
        ],
        questions5Mark: [
          'Explain the Armstrong method of FM generation.',
          'Describe how a Phase-Locked Loop (PLL) can be used to demodulate FM.'
        ],
        questions10Mark: [
          'With a neat circuit diagram, explain the working of a Foster-Seeley Discriminator.'
        ],
        quickRevision: [
          'Varactor diodes change capacitance with voltage, useful for VCOs.',
          'Armstrong method guarantees high frequency stability.',
          'Pre-emphasis/De-emphasis significantly improves the SNR at high message frequencies.'
        ],
        mcqs: [
          {
            question: 'The main advantage of the Indirect (Armstrong) method of FM generation is:',
            options: ['Simpler circuit', 'Higher frequency deviation', 'Better carrier frequency stability', 'Requires no multipliers'],
            correctAnswer: 'Better carrier frequency stability',
            explanation: 'Because it uses a highly stable crystal oscillator initially, the final carrier frequency is very stable compared to direct VCO methods.'
          }
        ]
      },
      {
        chapterNumber: 8,
        title: 'Noise in Communication Systems',
        shortDescription: 'Types of noise and their impact on system performance.',
        difficulty: 'Medium',
        examImportance: 'High',
        topics: ['Thermal Noise', 'Shot Noise', 'White Noise', 'Noise Figure', 'Signal-to-Noise Ratio (SNR)'],
        importantConcepts: ['AWGN (Additive White Gaussian Noise)', 'Noise Temperature'],
        formulas: ['Pn = k * T * B', 'F = SNR_in / SNR_out'],
        examples: ['Calculating thermal noise voltage across a resistor.'],
        content: `
# Noise in Communication Systems

## What is Noise?
Noise is an unwanted, random electrical signal that interferes with the transmission and processing of the message signal.

## Types of Noise
1. **Thermal (Johnson-Nyquist) Noise:** Generated by random thermal motion of electrons in resistors. Pn = kTB.
2. **Shot Noise:** Caused by the discrete nature of charge carriers crossing junctions (e.g., in diodes).
3. **White Noise:** Has a flat power spectral density (PSD) across all frequencies.

## Noise Metrics
- **Signal-to-Noise Ratio (SNR):** Ratio of signal power to noise power.
- **Noise Figure (F):** Measures how much a component degrades the SNR. F = SNR_in / SNR_out.
- **Equivalent Noise Temperature (Te):** Te = T0(F - 1). Useful in satellite receivers.
        `,
        questions2Mark: [
          'Define Thermal Noise.',
          'What is White Noise?'
        ],
        questions5Mark: [
          'Explain Noise Figure and Equivalent Noise Temperature.',
          'What is the difference between internal and external noise?'
        ],
        questions10Mark: [
          'Derive the expression for the overall Noise Figure of cascaded amplifiers (Friis Formula).'
        ],
        quickRevision: [
          'k = Boltzmann\'s constant (1.38 x 10^-23 J/K).',
          'Noise power is proportional to Bandwidth (B) and absolute Temperature (T).',
          'In cascaded systems, the first stage determines the overall noise figure the most.'
        ],
        mcqs: [
          {
            question: 'In a cascaded amplifier system, which stage is the most critical for noise performance?',
            options: ['The first stage', 'The middle stage', 'The last stage', 'All stages equally'],
            correctAnswer: 'The first stage',
            explanation: 'According to Friis\' formula, the noise figure of the first stage is unattenuated, while subsequent stages are divided by the gains of previous stages.'
          }
        ]
      },
      {
        chapterNumber: 9,
        title: 'Sampling and Pulse Modulation',
        shortDescription: 'Transitioning from continuous analog to discrete-time signals.',
        difficulty: 'Medium',
        examImportance: 'High',
        topics: ['Nyquist Sampling Theorem', 'Aliasing', 'PAM', 'PWM', 'PPM'],
        importantConcepts: ['Anti-aliasing Filter', 'Ideal vs Natural vs Flat-top Sampling'],
        formulas: ['fs >= 2fm'],
        examples: ['Voice is bandlimited to 3.4kHz, so telephone networks sample at 8kHz.'],
        content: `
# Sampling and Pulse Modulation

## Sampling Theorem
A continuous-time signal bandlimited to fm Hz can be perfectly reconstructed from its samples if the sampling rate (fs) is strictly greater than or equal to 2fm.
**fs ≥ 2fm** (Nyquist Rate).

## Aliasing
If fs < 2fm, high-frequency components fold over into the low-frequency spectrum, causing irreparable distortion called aliasing. Prevented by using an anti-aliasing low-pass filter before sampling.

## Pulse Analog Modulation
- **Pulse Amplitude Modulation (PAM):** Amplitude of pulses varies with message.
- **Pulse Width Modulation (PWM):** Width of pulses varies.
- **Pulse Position Modulation (PPM):** Position of pulses varies relative to a fixed slot.
        `,
        questions2Mark: [
          'State the Nyquist sampling theorem.',
          'What is aliasing and how is it prevented?'
        ],
        questions5Mark: [
          'Compare PAM, PWM, and PPM.',
          'Explain flat-top sampling and the aperture effect.'
        ],
        questions10Mark: [
          'Prove the sampling theorem mathematically in the frequency domain.'
        ],
        quickRevision: [
          'Nyquist Rate = 2fm. Nyquist Interval = 1 / (2fm).',
          'PWM and PPM are more immune to noise than PAM.',
          'Anti-aliasing filters are Low-Pass Filters.'
        ],
        mcqs: [
          {
            question: 'To perfectly reconstruct a signal with a maximum frequency of 5 kHz, the minimum sampling frequency must be:',
            options: ['5 kHz', '10 kHz', '15 kHz', '2.5 kHz'],
            correctAnswer: '10 kHz',
            explanation: 'According to the Nyquist theorem, fs must be at least 2 * fmax = 2 * 5 kHz = 10 kHz.'
          }
        ]
      },
      {
        chapterNumber: 10,
        title: 'Digital Communication Fundamentals',
        shortDescription: 'Quantization, Encoding, and Pulse Code Modulation (PCM).',
        difficulty: 'Hard',
        examImportance: 'High',
        topics: ['PCM', 'DPCM', 'Delta Modulation (DM)', 'Adaptive Delta Modulation (ADM)'],
        importantConcepts: ['Quantization Error', 'Granular Noise', 'Slope Overload'],
        formulas: ['Bit Rate (Rb) = n * fs', 'Quantization step = V_pp / 2^n', 'SQNR (dB) approx 1.8 + 6n'],
        examples: ['CD audio uses 16-bit quantization at 44.1kHz sampling.'],
        content: `
# Digital Communication Fundamentals

## Pulse Code Modulation (PCM)
The standard method of digitizing analog signals.
1. **Sampling:** Discretizes time.
2. **Quantization:** Discretizes amplitude into L = 2^n levels. This introduces Quantization Error.
3. **Encoding:** Converts levels into binary bits.

## Delta Modulation (DM)
Transmits only the *difference* between the current sample and previous sample using just 1 bit per sample.
- **Slope Overload Distortion:** When the signal changes too fast for the step size.
- **Granular Noise:** When the signal is constant but the steps keep toggling up and down.
- **Solution:** Adaptive Delta Modulation (ADM) varies the step size dynamically.
        `,
        questions2Mark: [
          'What is quantization noise?',
          'What is slope overload in Delta Modulation?'
        ],
        questions5Mark: [
          'Explain the block diagram of a PCM transmitter.',
          'Compare PCM and Delta Modulation.'
        ],
        questions10Mark: [
          'Derive the expression for Signal to Quantization Noise Ratio (SQNR) in a uniform PCM system.'
        ],
        quickRevision: [
          'Every extra bit in PCM adds roughly 6 dB to the SQNR.',
          'DM uses 1 bit per sample.',
          'DPCM encodes the difference between actual and predicted samples, saving bandwidth.'
        ],
        mcqs: [
          {
            question: 'In Delta Modulation, slope overload occurs when:',
            options: ['Step size is too large', 'Signal amplitude is too small', 'Signal changes too rapidly', 'Sampling rate is too high'],
            correctAnswer: 'Signal changes too rapidly',
            explanation: 'If the analog signal has a steep slope (high frequency/amplitude), the fixed small step size of DM cannot keep up.'
          }
        ]
      },
      {
        chapterNumber: 11,
        title: 'Digital Modulation Techniques',
        shortDescription: 'Transmitting digital bits over analog carrier waves.',
        difficulty: 'Hard',
        examImportance: 'High',
        topics: ['ASK', 'FSK', 'PSK', 'QPSK', 'QAM'],
        importantConcepts: ['Constellation Diagrams', 'Bit Rate vs Baud Rate', 'Bandwidth Efficiency'],
        formulas: ['Baud Rate = Bit Rate / log2(M)'],
        examples: ['Wi-Fi often uses 64-QAM or 256-QAM.'],
        content: `
# Digital Modulation Techniques

## Basic Techniques
- **Amplitude Shift Keying (ASK):** Binary 1 = Carrier ON, 0 = Carrier OFF (OOK). Very susceptible to noise.
- **Frequency Shift Keying (FSK):** Binary 1 = f1, 0 = f2. Better noise immunity.
- **Phase Shift Keying (PSK):** Binary 1 = 0° phase, 0 = 180° phase (BPSK). Highly robust.

## Advanced Techniques
- **QPSK (Quadrature PSK):** Transmits 2 bits per symbol using 4 phase shifts. Doubles spectral efficiency compared to BPSK.
- **QAM (Quadrature Amplitude Modulation):** Modulates both Amplitude and Phase. e.g., 16-QAM transmits 4 bits per symbol.

## Bit Rate vs Baud Rate
- **Bit Rate (Rb):** Number of bits per second.
- **Baud Rate (Symbol Rate):** Number of signal changes per second.
        `,
        questions2Mark: [
          'Differentiate between Bit Rate and Baud Rate.',
          'What is a constellation diagram?'
        ],
        questions5Mark: [
          'Draw the constellation diagrams for BPSK, QPSK, and 16-QAM.',
          'Explain the generation of a QPSK signal.'
        ],
        questions10Mark: [
          'Compare ASK, FSK, and PSK on the basis of bandwidth requirements, noise immunity, and probability of error.'
        ],
        quickRevision: [
          'M-ary systems transmit log2(M) bits per symbol.',
          'BPSK and QPSK have the same bit error rate performance, but QPSK uses half the bandwidth.',
          'QAM combines ASK and PSK.'
        ],
        mcqs: [
          {
            question: 'If the bit rate is 100 kbps in a 16-QAM system, what is the baud rate?',
            options: ['100 kbaud', '50 kbaud', '25 kbaud', '400 kbaud'],
            correctAnswer: '25 kbaud',
            explanation: '16-QAM transmits 4 bits per symbol. Baud Rate = Bit Rate / 4 = 100/4 = 25 kbaud.'
          }
        ]
      },
      {
        chapterNumber: 12,
        title: 'Communication System Performance and Applications',
        shortDescription: 'Information theory, channel capacity, and real-world systems.',
        difficulty: 'Medium',
        examImportance: 'Medium',
        topics: ['Shannon-Hartley Theorem', 'Information Entropy', 'Error Control Coding'],
        importantConcepts: ['Channel Capacity', 'Hamming Distance'],
        formulas: ['C = B * log2(1 + SNR)', 'H = -Sum P(x) log2 P(x)'],
        examples: ['Forward Error Correction (FEC) in deep space communications.'],
        content: `
# Communication System Performance

## Information Theory
- **Entropy (H):** Measure of average information content per symbol. Maximum when all symbols are equally likely.
- **Shannon-Hartley Theorem:** Gives the maximum theoretical data rate (Channel Capacity C) over a noisy channel.
  C = B * log2(1 + SNR)

## Error Control Coding
Because channels have noise, bits get flipped. We add redundant bits to detect and correct errors.
- **Parity Check:** Detects single-bit errors.
- **Block Codes (e.g., Hamming Code):** Can detect and correct errors.
- **Convolutional Codes:** Used in continuous bit streams.

## Applications
- Satellite Communications
- Mobile Networks (GSM, LTE, 5G)
- Optical Fiber Communications
        `,
        questions2Mark: [
          'State the Shannon-Hartley theorem.',
          'What is Entropy in information theory?'
        ],
        questions5Mark: [
          'Calculate the channel capacity of a telephone channel with B = 3 kHz and SNR = 30 dB.',
          'Explain the concept of Forward Error Correction (FEC).'
        ],
        questions10Mark: [
          'Discuss how channel coding improves system performance at the cost of bandwidth, using Hamming codes as an example.'
        ],
        quickRevision: [
          'To increase Capacity (C), you can increase Bandwidth (B) or SNR.',
          'Infinite bandwidth does NOT mean infinite capacity (it asymptotes because of thermal noise).',
          'Entropy is measured in bits/symbol.'
        ],
        mcqs: [
          {
            question: 'According to Shannon, if the bandwidth of a channel approaches infinity, the channel capacity approaches:',
            options: ['Infinity', 'Zero', 'A finite limit', 'Depends on the signal power'],
            correctAnswer: 'A finite limit',
            explanation: 'Because noise power also increases with bandwidth (Pn = kTB), the capacity approaches a finite limit of 1.44 * (S/N0).'
          }
        ]
      }
    ];

    for (const chapter of chaptersData) {
      await Note.findOneAndUpdate(
        { subject: subject._id, chapterNumber: chapter.chapterNumber },
        {
          title: chapter.title,
          shortDescription: chapter.shortDescription,
          difficulty: chapter.difficulty,
          examImportance: chapter.examImportance,
          topics: chapter.topics,
          importantConcepts: chapter.importantConcepts,
          formulas: chapter.formulas,
          examples: chapter.examples,
          questions2Mark: chapter.questions2Mark,
          questions5Mark: chapter.questions5Mark,
          questions10Mark: chapter.questions10Mark,
          quickRevision: chapter.quickRevision,
          mcqs: chapter.mcqs,
          content: chapter.content.trim(),
          author: user._id,
          isPublic: true
        },
        { upsert: true, new: true }
      );
    }

    console.log('✅ Successfully seeded Communication Systems study notes.');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Error seeding notes:', error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  seedCommunicationSystems();
} else {
  module.exports = seedCommunicationSystems;
}
