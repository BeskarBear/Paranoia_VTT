# Paranoia VTT System

Foundry VTT system for **Paranoia** (Core Rulebook 2023/2025 edition by Mongoose Publishing).

## Source Materials

- **Rulebook**: `/home/beskarbear/Documents/TTRPGs/Core Rulebook 07-01-25.pdf`
- **Text extract**: `assets/text/Core_Rulebook.txt`

## Core Mechanics

### Dice System
- **Dice pool (NODE)**: Stat + Skill + Equipment Level + 1 Computer Die
- **Success**: Roll d6s, each 5 or 6 = 1 success
- **Difficulty levels**: Easy (1), Average (2), Challenging (3), Hard (4), Impossible (5+)
- **Negative NODE**: If NODE < 0, roll 3 dice but failed dice (1-4) subtract from successes
- **Computer Die**: Always rolled. On Computer symbol (or 6), Friend Computer intervenes (good or bad based on Treason Stars)

### Key Character Data
- **Stats** (4): Violence, Brains, Chutzpah, Mechanics
- **Skills** (12): 3 per stat (e.g., Violence: Guns, Melee, Throw)
- **Clones**: 6 lives (clone numbers 1-6, decreasing as you die)
- **Moxie**: Spendable resource (up to 5 per roll) to convert failed dice to successes
- **XP Points**: Currency/reputation in Alpha Complex
- **Security Clearance**: Infrared → Red → Orange → Yellow → Green → Blue → Indigo → Violet → Ultraviolet
- **Treason Stars**: Accumulated suspicion (affects Computer Die results)
- **Flags**: Warning markers leading to "Wanted" status

### Health/Injury
- **Conditions**: Fine → Hurt → Injured → Maimed → Dead
- Each injury level reduces NODE by 1

### Mandatory Bonus Duties (MBDs)
Team roles assigned during missions:
- Team Leader
- Equipment Officer
- Happiness Officer
- Hygiene Officer
- Loyalty Officer
- Media Officer

### Secret Elements (per character)
- **Secret Society**: Illegal group membership
- **Mutant Power**: Hidden ability (treasonous if discovered)

## Data Model Considerations

```
Actor (Troubleshooter):
  - stats: { violence, brains, chutzpah, mechanics }
  - skills: { guns, melee, throw, science, etc. } (12 total)
  - cloneNumber: 1-6
  - moxie: current/max
  - xpPoints: number
  - securityClearance: string (infrared/red/orange/etc.)
  - treasonStars: 0-5
  - flags: number
  - condition: fine/hurt/injured/maimed/dead
  - secretSociety: string
  - mutantPower: string
  - mbd: string (current mission role)
```

## Roll Implementation

A Paranoia roll should:
1. Calculate NODE = stat + skill + equipment level
2. Add 1 Computer Die (visually distinct)
3. Roll all dice, count 5s and 6s as successes
4. Check Computer Die for special results
5. Allow Moxie spending to flip failures

## Setting Notes

- **Alpha Complex**: Underground/domed city ruled by The Computer
- **Tone**: Dark comedy, satire, PvP betrayal encouraged
- **Players don't need to know rules** - GM controls information asymmetry
