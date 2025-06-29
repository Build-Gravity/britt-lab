# AI Algorithm Planning for Rock-Paper-Scissors Experiment

## 🚀 **TEMPORARY JUMPSTART SECTION - DELETE AFTER SUCCESSFUL RESTART**

### **Context from Recent Session:**
We just completed a major design phase for upgrading the pattern-ai to a mathematically accurate ELPH implementation. Key decisions made:

**✅ COMPLETED TONIGHT:**
1. **Technical Explanation Page**: Created comprehensive `elph-algorithm-technical.html` with expandable concept cards explaining entropy, STM, hypotheses, parameter interactions - designed for high school level understanding
2. **CSS Migration**: Moved all styles from HTML to `styles.css` for reusability  
3. **Step 5 Rebranding**: Updated "Pattern Matcher" → "ELPH Algorithm (Pattern Recognition)" with direct link to technical explanation
4. **Parameter Overhaul**: Updated Step 5 settings to reflect our design decisions:
   - STM Length: 1-8 moves (extended from 1-3, capped due to 2^n hypothesis explosion)
   - Entropy Threshold: 0.5-2.0 (pattern reliability filtering)  
   - Min Observations: 2-10 (evidence required before trusting patterns)
   - Hypothesis Pruning: On/Off checkbox (remove unreliable patterns)

**✅ COMPLETED - ELPH TEST INFRASTRUCTURE:**
1. ✅ **Mathematical Accuracy Tests**: Created comprehensive `elph-math.test.js` with 10 tests covering:
   - Entropy calculation precision (perfect predictability H=0, perfect randomness H=1.585, biased patterns)
   - Hypothesis generation from STM (correct subpattern enumeration, scaling verification)
   - Soft-max selection accuracy (probability calculations, sum verification, edge cases)
2. ✅ **Performance Stress Tests**: Created `elph-performance.test.js` with 3 key tests:
   - STM 1-8 scaling under 2000ms threshold ✅ PASSED
   - 1000 trials with practical STM limits ✅ PASSED  
   - Worst-case pattern diversity handling ✅ PASSED
3. ✅ **Test Integration**: Updated both HTML and Node.js test runners, **all 30 tests passing**

**🔄 IMMEDIATE NEXT STEPS:**
1. **File Rebranding**: Rename `pattern-ai.js` → `elph-ai.js` and update all references in Step 5 & 6
2. **Core ELPH Implementation**: Implement mathematically accurate ELPH with verified helper functions
3. **Parameter Integration**: Connect Step 5 ELPH parameters to actual algorithm behavior

**🧠 KEY INSIGHTS CAPTURED:**
- **STM "Unlimited" Impossibility**: 2^n hypothesis generation makes unlimited STM computationally impossible. STM=8 (256 hypotheses) is the practical limit
- **Entropy = Pattern Predictability**: Low entropy = consistent patterns (80% scissors after rock-paper), high entropy = random patterns (33% each)
- **Parameter Interactions Matter**: STM length vs min observations creates reliability trade-offs; entropy threshold + min observations work together to filter patterns

---

## Project Overview
**Goal:** Implement engaging AI opponents for Step 6 of the psychology experiment tutorial using Test-Driven Development (TDD).

**Current Status:** 
- Step 6 file structure simplified and reorganized for clarity
- Educational AI implementations completed and tested
- ✅ **5 algorithms fully implemented and working**
- ELPH pattern-ai.js ready for enhancement with study-accurate algorithms
- RELPH algorithm planned for future implementation

**Recently Completed:**
- ✅ **File Reorganization**: Simplified AI structure with clear, educational code
  - `simple-ai.js`: ✅ 4 working strategies (random, counter, biased_random, frequency_counter)
  - `pattern-ai.js`: ✅ 1 working ELPH-like strategy (needs study-accurate enhancement)
  - `ai-explanations.html`: ✅ Detailed educational page
- ✅ **Step 5 & 6 Integration**: Updated configuration interfaces and experiment code
- ✅ **Educational Focus**: Code prioritizes learning over complex implementation
- ✅ **Original Study Replication**: Biased Random AI matches Mohammadi Sepahvand et al. (2014)

## Understanding ELPH/RELPH: Extensions for AI Opponents

**Research Context:** In the original study, ELPH and RELPH were computational models used to predict human behavior patterns. We're extending this by implementing them as actual AI opponents to explore new research questions about human-AI interaction and learning strategy detection.

## Current Algorithm Implementation Status

### ✅ **Phase 1: Simple Algorithms (COMPLETED - 4/4)**

#### 1.1 Random AI ✅ **IMPLEMENTED & TESTED**
**Strategy:** Completely random move selection  
**Location:** `SimpleAI('random')` in `simple-ai.js`  
**Parameters:** None  

#### 1.2 Counter AI ✅ **IMPLEMENTED & TESTED**
**Strategy:** Always counter the player's previous move  
**Location:** `SimpleAI('counter')` in `simple-ai.js`  
**Parameters:** None  

#### 1.3 Frequency Counter AI ✅ **IMPLEMENTED & TESTED**
**Strategy:** Counter the player's most frequent move  
**Location:** `SimpleAI('frequency_counter')` in `simple-ai.js`  
**Parameters:** None  

#### 1.4 Biased Random AI ✅ **IMPLEMENTED & TESTED**
**Strategy:** Random with configurable biases (matches original study)  
**Location:** `SimpleAI('biased_random')` in `simple-ai.js`  
**Parameters:**
- `phase1End` (default: 200) - When to switch from random to light bias
- `phase2End` (default: 400) - When to switch from light to heavy bias
- Phase probabilities match Mohammadi Sepahvand et al. (2014) exactly

### ✅ **Phase 2: ELPH Algorithm (PARTIALLY IMPLEMENTED - 1/1)**

#### 2.1 ELPH-like Pattern AI ✅ **BASIC IMPLEMENTATION COMPLETE**
**Strategy:** Statistical learning - predict opponent patterns, then counter  
**Location:** `PatternAI()` in `pattern-ai.js`  
**Current Status:** ✅ Working educational implementation  
**Next Step:** 🔄 **Enhance with study-accurate ELPH algorithms**

**Current Parameters (Tweakable):**
- `patternLength` (1-3) - How many moves to analyze for patterns
- `confidenceThreshold` (1-10) - Minimum pattern occurrences before prediction
- `learningRate` ('slow'/'moderate'/'fast') - How quickly to adapt to new patterns

**Study-Accurate Enhancement Needed:**
- Short Term Memory (STM) of configurable length (n=1-3)
- Hypothesis generation for all possible patterns from STM
- Entropy calculations for hypothesis reliability (H < Hthr)
- Hypothesis pruning based on entropy threshold
- Most reliable hypothesis selection for prediction

### 🔄 **Phase 2 Enhancement: Study-Accurate ELPH (IN PROGRESS)**

#### 2.2 ELPH Algorithm Enhancement - Study-Accurate Implementation
**Status:** 🔄 **DESIGN PHASE COMPLETE - READY FOR IMPLEMENTATION**  
**Next Steps:** Implement mathematically accurate ELPH with research formulas  

**Key Decisions Made:**
- **STM Limit:** Maximum 8 moves (due to 2^n hypothesis explosion, 2^8 = 256 manageable)
- **Pattern Approach:** Use sliding window of last X trials (matches original study approach)
- **Complexity:** Full mathematical accuracy while maintaining educational clarity

**Enhanced Parameters for Implementation:**
- `stmLength` (1-8) - Short term memory length, **extended from 1-3**
- `entropyThreshold` (0.5-2.0) - Maximum entropy for reliable hypotheses  
- `minObservations` (2-10) - Minimum data before hypothesis evaluation
- `hypothesisPruning` (true/false) - Whether to remove unreliable hypotheses

**Technical Understanding Clarified:**
- **Entropy in context:** Measures pattern predictability (low = consistent, high = random)
- **Parameter interactions:** STM length vs min observations creates reliability trade-offs
- **Computational limits:** ~512 hypotheses manageable, 1000+ becomes slow

### ❌ **Phase 3: RELPH Algorithm (DEFERRED)**

#### 3.1 RELPH AI Opponent 🔄 **PLANNED FOR FUTURE IMPLEMENTATION**
**Strategy:** Reinforcement learning - learn which of its own moves work best in contexts  
**Location:** Future `RELPH_AI()` class  
**Priority:** After ELPH enhancement complete  

**Planned Parameters (Tweakable):**
- `stmLength` (1-8) - Short term memory context length  
- `learningRate` (α) - Delta-learning rule parameter (0.1-0.9)
- `temperature` - Soft-max exploration vs exploitation balance
- `initialValues` - Starting reward values for moves in contexts

## Parameter Optimization Matrix

### 📊 **Step 5 Configuration Parameters Worth Tweaking**

| Algorithm | Parameter | Range | Impact | Step 5 UI | Step 6 Behavior |
|-----------|-----------|-------|---------|-----------|-----------------|
| **ELPH** | stmLength | 1-8 | High | ✅ Dropdown | Memory depth affects pattern complexity |
| **ELPH** | entropyThreshold | 0.5-2.0 | High | ⚠️ Needs impl | Pattern reliability filtering |
| **ELPH** | minObservations | 2-10 | Medium | ⚠️ Needs impl | Evidence required before prediction |
| **ELPH** | hypothesisPruning | On/Off | Medium | ⚠️ Needs impl | Remove unreliable patterns |
| **Biased Random** | phase1End | 50-300 | Medium | ⚠️ JSON only | When bias starts affecting play |
| **Biased Random** | phase2End | 200-500 | Medium | ⚠️ JSON only | When heavy bias begins |
| **RELPH** | learningRate (α) | 0.1-0.9 | High | ❌ Not implemented | How fast values update |
| **RELPH** | temperature | 0.1-2.0 | High | ❌ Not implemented | Exploration vs exploitation |
| **All** | numTrials | 5-100 | High | ✅ Slider | Total game length affects learning |
| **All** | feedbackDelay | 500-3000ms | Low | ✅ Slider | Affects player thinking time |

### 🎯 **Priority Parameter Enhancements for Step 5**

**High Priority (Implement Next):**
1. **Biased Random Phase Controls** - Add UI sliders for phase1End and phase2End
2. **ELPH Entropy Threshold** - Add parameter for hypothesis pruning (when study-accurate ELPH is implemented)
3. **RELPH Parameters** - Add learning rate and temperature controls (when RELPH is implemented)

**Medium Priority:**
1. **Pattern Fallback Strategy** - What to do when no patterns found (random vs frequency)
2. **AI Difficulty Presets** - Easy/Medium/Hard combinations of parameters

## Proposed Phase 2 Enhancement: Study-Accurate ELPH

### 🔄 **Current `pattern-ai.js` Limitations**
- ✅ Detects patterns correctly
- ✅ Tracks pattern frequencies
- ❌ **Missing:** Proper entropy calculations for hypothesis reliability
- ❌ **Missing:** Systematic hypothesis generation and pruning
- ❌ **Missing:** STM-based context management
- ❌ **Missing:** Research-accurate prediction reliability metrics

### 🎯 **Enhancement Plan for `pattern-ai.js`**
1. **Add STM Management** - Replace simple history with proper STM of length n
2. **Implement Hypothesis Generation** - Generate all possible pattern → move hypotheses
3. **Add Entropy Calculations** - H = -Σ(p_i * log(p_i)) for each hypothesis
4. **Implement Hypothesis Pruning** - Remove hypotheses where H > threshold
5. **Add Reliability Selection** - Choose most reliable (lowest entropy) hypothesis

### 📋 **New ELPH Parameters for Step 5**
- `stmLength` (1-3) - Short term memory length
- `entropyThreshold` (0.5-2.0) - Maximum entropy for reliable hypotheses
- `minObservations` (2-10) - Minimum data before hypothesis evaluation
- `hypothesisPruning` (true/false) - Whether to remove unreliable hypotheses

## TDD Strategy for ELPH Enhancement

### 🧪 **Test Priorities (In Order)**
1. **Mathematical Accuracy Tests:**
   - Entropy calculation correctness (known inputs → expected outputs)
   - Hypothesis generation from STM patterns
   - Soft-max probability distributions

2. **Behavioral Correctness Tests:**
   - Parameter combinations produce expected behavior changes
   - STM length affects pattern detection as expected
   - Entropy threshold filtering works correctly

3. **Edge Case Tests:**
   - No patterns found (fallback behavior)
   - All moves identical (entropy edge cases)
   - STM shorter than available history

### 💻 **Computational Complexity Findings**
- **STM 1-3:** < 10 hypotheses (instant)
- **STM 4-6:** 10-50 hypotheses (very fast)  
- **STM 7-8:** 50-250 hypotheses (manageable)
- **STM 9+:** 500+ hypotheses (performance concerns)

**Decision:** Cap STM at 8 moves for optimal performance/capability balance

### 🤔 **"Unlimited STM" Question Resolved**
**Original Idea:** Allow unlimited STM to remember entire game history  
**Reality Check:** True ELPH generates 2^n hypotheses from STM subsets  
**Problem:** STM=100 → 2^100 hypotheses (computationally impossible)  
**Solution:** 8-move limit gives rich pattern detection (256 max hypotheses) while staying fast  
**Alternative:** For "long memory" feeling, algorithm tracks full history but only uses last 8 for patterns

## Implementation Priority Queue

### 🚀 **Current Sprint (Next 1-2 weeks)**
1. **🔄 IN PROGRESS:** ELPH algorithm enhancement with mathematical formulas
2. **🔄 PLANNED:** File rebranding pattern-ai → elph-ai  
3. **🔄 PLANNED:** TDD test suite for mathematical accuracy

### 📅 **Short Term (1-2 months)**
1. **RELPH AI Implementation** - Full reinforcement learning opponent
2. **AI Difficulty Presets** - Easy/Medium/Hard parameter combinations
3. **Advanced Parameter Validation** - Ensure parameter combinations make psychological sense

### 🔬 **Research Extensions**
1. **AI Detection Experiments** - Can humans detect different learning strategies?
2. **Cross-Algorithm Learning** - How do humans adapt to different AI types in sequence?
3. **Parameter Sensitivity Analysis** - Which parameters most affect human behavior?

## Educational Value & TDD Approach

### 📚 **Learning Progression**
1. **Phase 1 (Simple):** Basic AI concepts, immediate feedback loops
2. **Phase 2 (ELPH):** Pattern recognition, statistical learning, hypothesis testing
3. **Phase 3 (RELPH):** Reinforcement learning, exploration vs exploitation

### ✅ **Test Coverage Status**
- ✅ **Phase 1:** Full test coverage for all 4 simple algorithms
- ⚠️ **Phase 2:** Basic tests exist, need study-accurate enhancement tests
- ❌ **Phase 3:** No tests yet (algorithm not implemented)

## Success Metrics

### ✅ **Completed Milestones**
- [x] 5 working AI algorithms with clear behavioral differences
- [x] Step 5 configuration interface with parameter controls
- [x] Step 6 integration with real-time algorithm switching
- [x] Educational explanations and tooltips
- [x] Test framework with comprehensive coverage
- [x] **Technical explanation page with expandable concept cards**
- [x] **ELPH algorithm design decisions and parameter clarifications**
- [x] **CSS migration and style reusability improvements**
- [x] **Step 5 ELPH rebranding with technical explanation link**
- [x] **Updated parameter controls (STM 1-8, entropy threshold, min observations, pruning)**
- [x] **🚀 MATHEMATICALLY ACCURATE ELPH IMPLEMENTATION COMPLETE**
- [x] **💯 COMPREHENSIVE TEST SUITE: 38/38 tests passing (100% success rate)**
  - Mathematical accuracy tests (10/10) ✅
  - Performance stress tests (3/3) ✅  
  - Behavioral correctness tests (8/8) ✅
  - Legacy compatibility tests (5/5) ✅
  - Integration tests (4/4) ✅
  - Simple AI tests (7/7) ✅
  - Game logic tests (1/1) ✅

### ✅ **Current Sprint: ELPH Implementation (COMPLETED SUCCESSFULLY!)**
- [x] **Technical Foundation:** Technical explanation page completed and reviewed
- [x] **Test Infrastructure:** Mathematical accuracy + performance tests (10+3 tests, all passing)
- [x] **Performance Validation:** STM 1-8 confirmed under 2000ms, baseline performance established
- [x] **File Rebranding:** Renamed `pattern-ai.js` to `elph-ai.js` with full backward compatibility
- [x] **Behavioral Testing:** Added 8 behavioral correctness tests covering parameter interactions and edge cases
- [x] **Core Implementation:** **STUDY-ACCURATE ELPH FULLY IMPLEMENTED** ✨
  - ✅ Entropy calculations using H = -Σ p_i * log2(p_i)
  - ✅ Hypothesis generation from STM subpatterns  
  - ✅ Soft-max selection: P(h_i) = exp(-H_i) / Σ exp(-H_j)
  - ✅ Parameter integration (STM length, entropy threshold, min observations, hypothesis pruning)
  - ✅ Fallback strategies and edge case handling
- [x] **Test Validation:** **ALL 38 TESTS PASSING** 🎯

### 🎯 **Next Milestones (After ELPH)**
- [x] **COMPLETED:** Step 5/6 UI integration with new ELPH parameters
- [ ] Enhanced Step 5 parameter controls for all tweakable values  
- [ ] RELPH reinforcement learning algorithm
- [ ] AI difficulty presets for different research contexts
- [ ] Parameter sensitivity analysis and recommendations

## 🎉 **MAJOR MILESTONE ACHIEVED: STUDY-ACCURATE ELPH COMPLETE**

We have successfully implemented a mathematically accurate ELPH (Entropy Learned Pruned Hypothesis space) algorithm based on the Mohammadi Sepahvand et al. (2014) research. This represents a significant advancement from the simple pattern-matching AI to a sophisticated computational model suitable for actual psychology experiments.

**Key Achievements:**
- ✨ **Implementation**: Real entropy calculations, hypothesis generation, and soft-max selection
- 🧪 **Rigorous Testing**: 38 comprehensive tests covering mathematical accuracy, performance, and behavioral correctness
- ⚡ **Performance Validated**: STM 1-8 confirmed under 2000ms response time requirement
- 🔄 **Backward Compatible**: Legacy PatternAI tests still pass while using advanced ELPH underneath
- 📚 **Educational Value**: Code maintains clarity and educational value while being mathematically precise

**Technical Capabilities Now Available:**
- STM-based pattern analysis with configurable memory length (1-8 moves)
- Entropy-based reliability filtering (H ≤ threshold)
- Hypothesis pruning for noise reduction
- Soft-max probability selection for robust decision-making
- Intelligent fallback strategies for edge cases
- Comprehensive pattern database with real-time learning

This implementation transforms the psychology experiment tutorial from a simple educational exercise into a platform capable of supporting legitimate research into human-AI interaction and learning strategy detection.

---

*This plan maintains the educational focus while building toward research-accurate implementations suitable for actual psychology experiments.*   