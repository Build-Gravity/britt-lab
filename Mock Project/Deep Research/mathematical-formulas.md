	# S2. Mathematical Formulas

## ELPH Model Formulas

### Hypothesis-selection rule in ELPH
**Probability of selecting Hyp_i is proportional to its entropy:**

$$P(\text{Hyp}_i) = \frac{\exp(-H(\text{Hyp}_i))}{\sum_j \exp(-H(\text{Hyp}_j))}$$

### Choice-selection rule in ELPH
**Probability of selecting each e_i in the prediction-set of Hyp is proportional to its count (c_i):**

$$P(e_i) = \frac{c_i}{\sum_j c_j}$$

## RELPH Model Formulas

### Hypothesis-selection rule in RELPH
**Probability of selecting Hyp_i is proportional to its value (known as soft-max formula):**

$$P(\text{Hyp}_i) = \frac{\exp(V(\text{Hyp}_i))}{\sum_j \exp(V(\text{Hyp}_j))}$$

### Choice-selection rule in RELPH
**Probability of selecting each e_i in the prediction-set of Hyp is proportional to its accumulated reward (known as soft-max formula):**

$$P(e_i) = \frac{\exp(r_i)}{\sum_j \exp(r_j)}$$

## Notation

- **Hyp_i**: Individual hypothesis i
- **H(Hyp_i)**: Entropy of hypothesis i
- **V(Hyp_i)**: Value of hypothesis i
- **e_i**: Event/choice i
- **c_i**: Count of event i
- **r_i**: Accumulated reward for choice i
- **j**: Index for summation over all hypotheses or choices

## Notes

These formulas are part of the supplementary material (S2) from the research paper on Sequential Decisions comparing observational and reinforcement accounts using ELPH and RELPH computational models.

The key difference between the models:
- **ELPH** uses entropy-based hypothesis selection and count-based choice selection
- **RELPH** uses value-based (soft-max) hypothesis selection and reward-based (soft-max) choice selection 