// Crystal Ballers – Built-in Plan Content
// In-Season + Off-Season — native interactive plans (no PDF needed)
'use strict';

const PLAN_CONTENT = {

  // ═══════════════════════════════════════════════════════
  // PLAN 1: PIŁKARZ IN-SEASON
  // ═══════════════════════════════════════════════════════
  'plan1': {
    name: 'Piłkarz In-Season',
    iconKey: 'inseason',
    color: '#22c55e',
    totalWeeks: 12,
    intro: 'W trakcie sezonu każdy trening musi być precyzyjny i podporządkowany jednemu celowi: utrzymać Twoją dyspozycję na meczach i stopniowo budować formę, nie obciążając przy tym regeneracji po jednostkach zespołowych i spotkaniach ligowych.<br><br>Dlatego „Piłkarz In-Season" opiera się wyłącznie na metodach sprawdzonych w pracy z setkami zawodników — takich, które utrzymują i rozwijają siłę, dynamikę oraz wytrzymałość specyficzną dla piłki nożnej, nie generują dodatkowego zmęczenia kumulującego się w mikrocyklu i wpasowują się w typowy tygodniowy plan treningów i meczów.',
    structure: '3 treningi tygodniowo · 12 tygodni · 3 fazy po 4 tygodnie',

    phases: [
      // ─── FAZA 1 ───────────────────────────────────────
      {
        num: 1, name: 'Faza 1', weeks: 4,
        focus: 'Baza siły i mocy',
        description: 'Mezocykl bazowy — budowanie fundamentu siłowego i bazowej mocy plyometrycznej. Box Squat na 80% RM, ciężka praca z trap-barem.',
        workouts: [
          {
            id: 'p1-1-A', letter: 'A', title: 'Dół + Moc', type: 'lower',
            description: 'Sesja siłowo-plyometryczna ukierunkowana na łańcuch dolny. Zacznij od plyometrii, przejdź do siły.',
            duration: '60–75 min',
            sections: [
              {
                name: 'Sekcja Plyometrii',
                exercises: [
                  { name: 'Pogo Jumps', sets: 2, reps: '10', desc: 'Krótkie, sprężyste podskoki w miejscu na palcach. Minimalny kontakt z ziemią, akcent na sztywność kostki.' },
                  { name: 'Single Leg Lateral Hops', sets: 2, reps: '5/str', desc: 'Boczne wyskoki na jednej nodze — kontrola lądowania i stabilność stawu skokowego.' },
                  { name: 'Drop Jump', sets: 2, reps: '3', notes: 'box 30cm', desc: 'Zeskok z podwyższenia (30cm) i natychmiastowy maksymalny wyskok pionowy. Pracuj nad krótkim czasem kontaktu.' }
                ]
              },
              {
                name: 'Sekcja Siłowa',
                exercises: [
                  { name: 'Trap Bar High Pull', sets: 3, reps: '3', rpe: 'RPE 7–8 (RIR 2–3)', desc: 'Eksplozywne pociągnięcie sztangi trap-bar do klatki. Moc całkowita ciała.' },
                  { name: 'Box Squat', sets: 3, reps: '3', notes: '80% RM', desc: 'Przysiad ze sztangą na skrzyni — pełna kontrola ekscentryczna, eksplozja z dołu.' },
                  { name: 'Split Stance RDL', sets: 2, reps: '5/str', desc: 'Martwy ciąg w pozycji podzielonej. Siła łańcucha tylnego + stabilizacja jednonóż.' },
                  { name: 'Copenhagen Plank', sets: 2, reps: '20–30s', desc: 'Deska boczna z górną nogą wspartą o ławkę. Wzmacnia przywodziciele — kluczowe w prewencji urazów pachwiny.' },
                  { name: 'Pallof Press Split Stance', sets: 2, reps: '6/str', desc: 'Anti-rotacja — wyciskanie linki/gumy z pozycji bocznej, opierając się rotacji tułowia.' }
                ]
              }
            ]
          },
          {
            id: 'p1-1-B', letter: 'B', title: 'Biegowy', type: 'running',
            description: 'Sesja techniczna i sprintowa. Sprinty submaksymalne — wybiegasz ~85–90% maksymalnej prędkości.',
            duration: '40–50 min',
            sections: [
              {
                name: 'Sekcja Techniczna',
                exercises: [
                  { name: 'A Skip', sets: 2, reps: '20m', desc: 'Drill biegowy z wysokim podniesieniem kolana. Aktywacja zginaczy bioder i ABC techniki biegu.' },
                  { name: 'B Skip', sets: 2, reps: '20m', desc: 'Rozszerzenie A Skip — z wyrzutem podudzia w przód, „kopnięcie" w ziemię.' },
                  { name: 'Straight Leg Bounds', sets: 2, reps: '20m', desc: 'Skoki na prostych nogach. Pracuj nad sztywnością ścięgna Achillesa.' }
                ]
              },
              {
                name: 'Sekcja Sprintów',
                exercises: [
                  { name: 'Przyspieszenia', sets: 4, reps: '20m', desc: 'Start z pozycji 3-punktowej, pełna eksplozja na pierwsze 20m. Pełna przerwa między próbami (2–3 min).' },
                  { name: 'Sprinty submaksymalne', sets: 3, reps: '30m', notes: '~90% prędkości', desc: 'Kontrolowane sprinty z 90% intensywnością. Skup się na technice i odbiciach.' },
                  { name: 'Broad Jump', sets: 3, reps: '2', desc: 'Maksymalny wyskok w dal z obunoża. Test mocy poziomej.' }
                ]
              }
            ]
          },
          {
            id: 'p1-1-C', letter: 'C', title: 'Góra', type: 'upper',
            description: 'Trening górnej części ciała + plyometria piłką lekarską. Stabilność barku i siła wypychania.',
            duration: '50–60 min',
            sections: [
              {
                name: 'Sekcja Plyometrii',
                exercises: [
                  { name: 'MedBall Chest Pass', sets: 3, reps: '3', desc: 'Eksplozywny wyrzut piłki lekarskiej z klatki — moc górnej części ciała.' },
                  { name: 'MedBall Rotational Throw', sets: 3, reps: '3/str', desc: 'Rotacyjny wyrzut piłki w ścianę. Moc rotacyjna tułowia — kluczowa dla strzału.' }
                ]
              },
              {
                name: 'Sekcja Siłowa',
                exercises: [
                  { name: 'Bench Press', sets: 3, reps: '3', rpe: 'RPE 7–8 (RIR 2–3)', desc: 'Klasyczne wyciskanie sztangi na ławce poziomej.' },
                  { name: 'Wiosłowanie hantlą', sets: 3, reps: '6/str', desc: 'Jednoręczne wiosłowanie hantlą w opadzie. Symetria pleców.' },
                  { name: 'Half Kneeling DB OHP', sets: 2, reps: '6/str', desc: 'Wyciskanie hantli nad głowę z pozycji półklęku — stabilność core + bark.' },
                  { name: 'Nordic Eccentric', sets: 2, reps: '4', notes: 'tylko faza ekscentryczna', desc: 'Powolne opadanie z pozycji klęku — ekscentryczne wzmocnienie dwugłowych ud. Kluczowa prewencja urazów.' }
                ]
              }
            ]
          }
        ]
      },

      // ─── FAZA 2 ───────────────────────────────────────
      {
        num: 2, name: 'Faza 2', weeks: 4,
        focus: 'Konwersja na szybkość',
        description: 'Konwersja siły na moc i szybkość. Trap Bar Jump, assisted pogos, 5-0-5 drill — większy nacisk na prędkość ruchu.',
        workouts: [
          {
            id: 'p1-2-A', letter: 'A', title: 'Dół + Szybkość', type: 'lower',
            description: 'Plyometria + siła z naciskiem na prędkość wykonania.',
            duration: '55–70 min',
            sections: [
              {
                name: 'Sekcja Plyometrii',
                exercises: [
                  { name: 'Assisted Pogo Jumps', sets: 2, reps: '10', desc: 'Pogo Jumps z odciążeniem (taśma/wspomaganie). Trening prędkości lotu.' },
                  { name: 'Single Leg Broad Jump', sets: 2, reps: '3/str', desc: 'Maksymalny wyskok w dal na jednej nodze — moc jednonóż.' }
                ]
              },
              {
                name: 'Sekcja Siłowa',
                exercises: [
                  { name: 'Trap Bar Jump', sets: 3, reps: '3', desc: 'Wyskok ze sztangą trap-bar — moc całkowita. Maksymalna szybkość koncentryczna.' },
                  { name: 'RFESS', sets: 2, reps: '3/str', rpe: 'RPE 8 (RIR 2)', desc: 'Bułgarski przysiad (Rear Foot Elevated Split Squat) — siła jednonóż.' },
                  { name: 'Seated/Lying Hamstring Curl', sets: 2, reps: '6', desc: 'Uginanie nóg w pozycji siedzącej lub leżącej — izolacja dwugłowych.' }
                ]
              }
            ]
          },
          {
            id: 'p1-2-B', letter: 'B', title: 'Biegowy', type: 'running',
            description: 'Krótkie, eksplozywne sprinty + drill zmiany kierunku.',
            duration: '35–45 min',
            sections: [
              {
                name: 'Sekcja Sprintów',
                exercises: [
                  { name: 'Przyspieszenia', sets: 5, reps: '15m', desc: 'Krótkie, maksymalne przyspieszenia. Pełna przerwa między próbami (2–3 min).' }
                ]
              },
              {
                name: 'Sekcja Zwinności',
                exercises: [
                  { name: '5-0-5 Drill', sets: 2, reps: '/str', desc: 'Klasyczny test zmiany kierunku 5+5 metrów na 180°. Wykonaj 2 próby na każdą stronę.' }
                ]
              }
            ]
          },
          {
            id: 'p1-2-C', letter: 'C', title: 'Góra', type: 'upper',
            description: 'Moc rotacyjna i siła pociągowa.',
            duration: '45–55 min',
            sections: [
              {
                name: 'Sekcja Plyometrii',
                exercises: [
                  { name: 'MedBall Overhead Throw', sets: 3, reps: '3', desc: 'Wyrzut piłki znad głowy do tyłu — moc tylnego łańcucha.' },
                  { name: 'MedBall Rotational Throw', sets: 3, reps: '3/str', desc: 'Rotacyjny wyrzut piłki w ścianę. Moc rotacyjna.' }
                ]
              },
              {
                name: 'Sekcja Siłowa',
                exercises: [
                  { name: 'Bench Press', sets: 2, reps: '3', rpe: 'RPE 8 (RIR 2)', desc: 'Cięższy bench — mniejszy volume.' },
                  { name: 'Podciąganie nachwytem', sets: 3, reps: '5', desc: 'Klasyczne podciąganie nachwytem — siła pleców.' },
                  { name: 'AB Wheel lub Plank', sets: 2, reps: '10pwt / MAXs', desc: 'AB Wheel: 10 powtórzeń. Plank: maksymalny czas.' }
                ]
              }
            ]
          }
        ]
      },

      // ─── FAZA 3 ───────────────────────────────────────
      {
        num: 3, name: 'Faza 3', weeks: 4,
        focus: 'Peak — utrzymanie i regeneracja',
        description: 'Faza końcowa — niższy volume, utrzymanie szczytowej formy. Mniej powtórzeń, większy nacisk na regenerację po meczach.',
        workouts: [
          {
            id: 'p1-3-A', letter: 'A', title: 'Dół + Szybkość', type: 'lower',
            description: 'Krótka, intensywna sesja utrzymaniowa.',
            duration: '45–55 min',
            sections: [
              {
                name: 'Sekcja Plyometrii',
                exercises: [
                  { name: 'Pogo Jumps', sets: 2, reps: '10', desc: 'Aktywacja sztywności kostki.' }
                ]
              },
              {
                name: 'Sekcja Siłowa',
                exercises: [
                  { name: 'Trap Bar Jump', sets: 2, reps: '3', desc: 'Utrzymaniowa moc.' },
                  { name: 'Split Squat', sets: 2, reps: '2/str', desc: 'Statyczne wykroki ze sztangą.' },
                  { name: 'Copenhagen Plank', sets: 2, reps: '20s', desc: 'Prewencja pachwiny.' }
                ]
              }
            ]
          },
          {
            id: 'p1-3-B', letter: 'B', title: 'Biegowy', type: 'running',
            description: 'Sesja sprintowa z minimalnym volume — peak prędkości.',
            duration: '30–40 min',
            sections: [
              {
                name: 'Sekcja Sprintów',
                exercises: [
                  { name: 'Przyspieszenia', sets: '3–4', reps: '10–20m', desc: 'Krótkie, maksymalne starty.' },
                  { name: 'Sprinty submaksymalne', sets: 2, reps: '30m', desc: 'Kontrolowane 90% sprinty.' }
                ]
              }
            ]
          },
          {
            id: 'p1-3-C', letter: 'C', title: 'Góra', type: 'upper',
            description: 'Krótka sesja utrzymaniowa górnej części ciała.',
            duration: '40–50 min',
            sections: [
              {
                name: 'Sekcja Siłowa',
                exercises: [
                  { name: 'Bench Press', sets: 2, reps: '2', rpe: 'RPE 8 (RIR 2)', desc: 'Minimalny volume, maksymalny ciężar.' },
                  { name: 'Wiosłowanie sztangą', sets: 2, reps: '5', desc: 'Wiosłowanie sztangą w opadzie.' },
                  { name: 'MedBall Throw', sets: 2, reps: '2', desc: 'Moc rotacyjna utrzymaniowa.' },
                  { name: 'Plank', sets: 2, reps: 'MAXs', desc: 'Klasyczna deska — maksymalny czas.' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 2: ZIMOWY OFF-SEASON
  // ═══════════════════════════════════════════════════════
  'plan2': {
    name: 'Zimowy Off-Season',
    iconKey: 'winter',
    color: '#60a5fa',
    totalWeeks: 12,
    intro: 'Plan ma jeden cel: wyciągnąć Cię ponad Twój obecny poziom, nawet jeśli wydaje Ci się, że już dużo zrobiłeś i ciężko coś jeszcze poprawić.<br><br>Skupiamy się na tym, co faktycznie przekłada się na boisko: szybkości, dynamice i kontroli pracy mięśni w hamowaniu i przyspieszaniu. To właśnie te elementy odróżniają przeciętnych zawodników od tych, którzy robią różnicę na boisku.<br><br>Po zakończeniu programu będziesz lepiej biegać technicznie, szybciej reagować i poruszać się pewniej w każdej sytuacji meczowej.',
    structure: '3 fazy · podziały Push/Pull, FBW i Power-focused',

    phases: [
      // ─── FAZA 1 ───────────────────────────────────────
      {
        num: 1, name: 'Faza 1', weeks: 4,
        focus: 'Hipertrofia i baza',
        description: 'Klasyczny split Góra/Dół — budowanie masy mięśniowej i bazy aerobowej. Trening biegowy buduje wytrzymałość tlenową.',
        workouts: [
          {
            id: 'p2-1-G', letter: 'G', title: 'Góra ciała', type: 'upper',
            frequency: '2× w tygodniu',
            description: 'Klasyczna sesja górnej części ciała — push + pull + akcesoria.',
            duration: '60–75 min',
            sections: [
              {
                exercises: [
                  { name: 'Wyciskanie sztangi na ławce', sets: 4, reps: '8–10', rpe: 'RIR 1', rest: 'Pełny', desc: 'Klasyczne wyciskanie sztangi — pełna przerwa między seriami.' },
                  { name: 'Wiosłowanie sztangą', sets: 4, reps: '8–10', rpe: 'RIR 1', rest: 'Pełny', desc: 'Wiosłowanie sztangą w opadzie. Plecy szerokie i grube.' },
                  { name: 'Wyciskanie żołnierskie', sets: 3, reps: '6–8', rpe: 'RIR 1', rest: 'Pełny', desc: 'Military Press — wyciskanie sztangi nad głowę stojąc.' },
                  { name: 'Podciąganie nachwytem', sets: 3, reps: '6–8', rpe: 'RIR 1', rest: 'Pełny', notes: 'szeroki chwyt', desc: 'Klasyczne podciąganie nachwytem szerokim chwytem.' },
                  { name: 'Uginanie na biceps', sets: 3, reps: '10–12', rpe: 'RIR 1–0', rest: '2–3 min', desc: 'Klasyczne uginanie ramion ze sztangą lub hantlami.' },
                  { name: 'Prostowanie tricepsów', sets: 3, reps: '10–12', rpe: 'RIR 1–0', rest: '2–3 min', desc: 'Wyciskanie francuskie lub prostowanie na wyciągu.' }
                ]
              }
            ]
          },
          {
            id: 'p2-1-D', letter: 'D', title: 'Dół ciała', type: 'lower',
            frequency: '2× w tygodniu',
            description: 'Klasyczna sesja dolnej części ciała — przysiad + martwy ciąg + akcesoria.',
            duration: '60–75 min',
            sections: [
              {
                exercises: [
                  { name: 'Przysiad ze sztangą', sets: 4, reps: '8–10', rpe: 'RIR 1', rest: 'Pełny', desc: 'Klasyczny przysiad tylny ze sztangą. Pełna głębokość.' },
                  { name: 'Martwy ciąg na prostych nogach', sets: 4, reps: '10–12', rpe: 'RIR 1', rest: 'Pełny', desc: 'RDL (Romanian Deadlift) — straight-leg deadlift. Praca tylnego łańcucha.' },
                  { name: 'Wykroki', sets: 3, reps: '10–12/str', rpe: 'RIR 1', rest: '2–3 min', desc: 'Wykroki w przód ze sztangą lub hantlami.' },
                  { name: 'Hip Thrust', sets: 3, reps: '10–12', rpe: 'RIR 1', rest: '2–3 min', desc: 'Wypchnięcia bioder ze sztangą. Pośladek górą — gluty i moc startowa.' }
                ]
              }
            ]
          },
          {
            id: 'p2-1-BA', letter: 'BA', title: 'Bieg A — Wytrzymałość', type: 'running',
            frequency: '1× w tygodniu',
            description: 'Bieg ciągły w 65–75% HRmax. Powinieneś czuć zmęczenie, ale spokojnie prowadzić rozmowę.',
            duration: '25–35 min',
            sections: [
              {
                exercises: [
                  { name: 'Bieg ciągły', sets: 1, reps: '25–35 min', notes: '65–75% HRmax', desc: 'Bieg w komfortowym tempie. 65–75% HRmax = tempo konwersacyjne. Buduje bazę aerobową.' }
                ]
              }
            ]
          },
          {
            id: 'p2-1-BB', letter: 'BB', title: 'Bieg B — Rytmy', type: 'running',
            frequency: '1× w tygodniu',
            description: 'Submaksymalne rytmy 60m + trucht regeneracyjny.',
            duration: '30–45 min',
            sections: [
              {
                exercises: [
                  { name: 'Rytmy submaksymalne', sets: 8, reps: '60m', notes: 'trucht 20–60s między odcinkami', desc: 'Submaksymalne tempo (~85%) na 60m. Trucht 30–60s między odcinkami. Staraj się skrócić trucht do 20s w miarę progresu.' }
                ]
              }
            ]
          }
        ]
      },

      // ─── FAZA 2 ───────────────────────────────────────
      {
        num: 2, name: 'Faza 2', weeks: 4,
        focus: 'Siła maksymalna (FBW)',
        description: 'Full Body Workout 3× w tygodniu. Niski volume, wysoka intensywność. Box Squat z naciskiem na ekscentrykę, klasyczny deadlift.',
        workouts: [
          {
            id: 'p2-2-FBW', letter: 'F', title: 'FBW — Trening całego ciała', type: 'fbw',
            frequency: '3× w tygodniu',
            description: 'Pełnoobjętościowy trening całego ciała. Skup się na technice i prędkości ruchu w fazie koncentrycznej.',
            duration: '70–90 min',
            sections: [
              {
                exercises: [
                  { name: 'Box Squat', sets: 5, reps: '3–5', rpe: 'RIR 2-2-1-1-1', rest: 'Pełny', notes: 'powoli dół, szybko góra', desc: 'Box Squat — schodź jak najwolniej, ekscentryczna kontrola. Eksplozja z dołu maksymalnie szybko.' },
                  { name: 'Martwy ciąg klasyczny', sets: 4, reps: '3–5', rpe: 'RIR 1', rest: 'Pełny', desc: 'Conventional deadlift. Sztanga przy goleniach, ścisły setup.' },
                  { name: 'Wyciskanie sztangi', sets: 4, reps: '4–6', rpe: 'RIR 1', rest: 'Pełny', notes: 'powoli dół, szybko góra', desc: 'Bench Press — powolna ekscentryka, eksplozywna koncentryka.' },
                  { name: 'Podciąganie', sets: 4, reps: '6–8', rpe: 'RIR 1', rest: '2–3 min', notes: 'dynamicznie, nie pod technikę kulturystyczną', desc: 'Wykonuj dynamicznie — fokus na mocy pociągu, nie izolacji.' },
                  { name: 'Rwanie hantli / Zarzut hantli', sets: 3, reps: '5–8', rpe: 'RIR 1', rest: '2–3 min', desc: 'DB Snatch lub DB Power Clean — moc całkowita ciała.' },
                  { name: 'Deska — Plank', sets: 3, reps: '1 min', rest: '1–2 min', desc: 'Klasyczna deska. Pełen 1 min na serię.' }
                ]
              }
            ]
          },
          {
            id: 'p2-2-BA', letter: 'BA', title: 'Bieg A — Wytrzymałość', type: 'running',
            frequency: '1× w tygodniu',
            description: 'Bieg ciągły w wyższym tempie (70–80% HRmax).',
            duration: '30–40 min',
            sections: [
              {
                exercises: [
                  { name: 'Bieg ciągły', sets: 1, reps: '30–40 min', notes: '70–80% HRmax', desc: 'Tempo wyższe niż w Fazie 1. Jeszcze rozmowne, ale wymaga większego skupienia.' }
                ]
              }
            ]
          },
          {
            id: 'p2-2-BB', letter: 'BB', title: 'Bieg B — Przyspieszenia', type: 'running',
            frequency: '1× w tygodniu',
            description: 'Krótkie sprinty z pełną przerwą.',
            duration: '40–50 min',
            sections: [
              {
                exercises: [
                  { name: 'Przyspieszenia', sets: 10, reps: '20–30m', notes: 'Pełna przerwa 3–4 min', rest: '3–4 min', desc: '10 maksymalnych startów. Pełna przerwa — chodzi o jakość, nie kondycję.' }
                ]
              }
            ]
          }
        ]
      },

      // ─── FAZA 3 ───────────────────────────────────────
      {
        num: 3, name: 'Faza 3', weeks: 4,
        focus: 'Moc i szybkość',
        description: 'Konwersja siły na moc. Loaded Jumps, Hang Clean, sprinty maksymalne. Peak motoryczny przed sezonem.',
        workouts: [
          {
            id: 'p2-3-S', letter: 'S', title: 'Trening Siłowy', type: 'strength',
            frequency: '3× w tygodniu',
            description: 'Wszystko z dużym ciężarem — moc całkowita. Skup się na prędkości koncentrycznej.',
            duration: '60–75 min',
            sections: [
              {
                name: 'Część główna',
                exercises: [
                  { name: 'Skoki z przysiadu (Loaded Jumps)', sets: 4, reps: '4–6', rpe: 'RIR 1', notes: 'duży ciężar', desc: 'Wyskok ze sztangą — duży ciężar (~30–40% RM). Każdy wyskok maksymalnie eksplozywny.' },
                  { name: 'Zarzut sztangi (Hang Clean)', sets: 5, reps: '3–5', rpe: 'RIR 2', notes: 'duży ciężar', desc: 'Power Clean z zwisu (z poziomu kolan). Moc całkowita ciała — najważniejsze ćwiczenie w fazie.' },
                  { name: 'Przysiady', sets: 3, reps: '3–5', rpe: 'RIR 1', notes: 'duży ciężar', desc: 'Klasyczny przysiad — niski volume, ciężar maksymalny.' },
                  { name: 'Hip Thrust', sets: 4, reps: '4–6', rpe: 'RIR 2-1-1-1', notes: 'duży ciężar', desc: 'Hip Thrust z bardzo dużym ciężarem. Eksplozywne wypchnięcie bioder.' }
                ]
              },
              {
                name: 'Core + Mobilność',
                exercises: [
                  { name: 'Core + Mobilność', sets: 1, reps: '10–15 min', desc: 'Krótka sekcja na koniec — wybierz 2–3 ćwiczenia core (plank, dead bug, pallof) + mobilność bioder i kostek.' }
                ]
              }
            ]
          },
          {
            id: 'p2-3-BA', letter: 'BA', title: 'Bieg A — Zwinność', type: 'running',
            frequency: '1× w tygodniu',
            description: 'Krótkie przyspieszenia + zmiany kierunku — przygotowanie do gry.',
            duration: '35–45 min',
            sections: [
              {
                exercises: [
                  { name: 'Przyspieszenia + zmiany kierunku', sets: '8–10', reps: '20m', desc: '8–10 startów z dodaniem zmiany kierunku na końcu. Imituj sytuacje meczowe.' }
                ]
              }
            ]
          },
          {
            id: 'p2-3-BB', letter: 'BB', title: 'Bieg B — Sprinty maksymalne', type: 'running',
            frequency: '1× w tygodniu',
            description: 'Prędkość maksymalna. Pełna regeneracja między próbami.',
            duration: '35–45 min',
            sections: [
              {
                exercises: [
                  { name: 'Sprinty maksymalne', sets: 6, reps: '40–60m', rest: '2–3 min', notes: 'Pełna regeneracja', desc: 'Maksymalna prędkość biegowa. Pełna regeneracja 2–3 min między próbami — chodzi o jakość, nie o objętość.' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // PLAN 3: LETNI OFF-SEASON  (pełna treść)
  // ═══════════════════════════════════════════════════════
  'plan_letni': {
    name: 'Letni Off-Season',
    iconKey: 'summer',
    color: '#f59e0b',
    totalWeeks: 8,
    intro: 'Stworzony po to, żeby przenieść Twoją grę na zupełnie nowy poziom. Przez 8 intensywnych tygodni połączysz pracę na siłowni, piłkarskie sesje na boisku i sprawdzone metody regeneracji, żeby zbudować siłę, podnieść poziom kondycji i wejść w nowy sezon w formie profesjonalnego zawodnika.',
    structure: '8 tygodni · 3 fazy · siłownia + boisko + regeneracja',

    phases: [
      // ═══ FAZA 1 (tyg. 1-3) — BAZA / HIPERTROFIA ═══════
      {
        num: 1, name: 'Faza 1', weeks: 3,
        focus: 'Baza / Hipertrofia',
        description: 'Pierwsze 3 tygodnie to budowanie bazy mięśniowej i wytrzymałości tlenowej. Tempo wykonywania ćwiczeń kontrolowane, większe objętości, RPE 7-8.',
        workouts: [
          // ── Trening A — siłownia (squat-dominant) ───
          {
            id: 'pl-1-A', letter: 'A', title: 'Trening A — Siłownia (push)', type: 'strength', frequency: '1× w tygodniu',
            description: 'Sesja siłowa z dominacją przysiadu + push (klatka, OHP) + core.',
            duration: '70–80 min',
            sections: [
              {
                name: 'Aktywacja / mobilizacja (10 min)',
                exercises: [
                  { name: 'Rower stacjonarny lub trucht', sets: 1, reps: '5 min', rpe: 'RPE 5' },
                  { name: "World's Greatest Stretch", sets: 1, reps: '5/stronę' },
                  { name: 'Glute bridge (aktywacja pośladków)', sets: 2, reps: '12', rest: '30 s' },
                  { name: 'Band pull-apart + krążenia barków', sets: 2, reps: '15', rest: '30 s' }
                ]
              },
              {
                name: 'BLOK A — Dolne partie (dominacja przysiadu)',
                exercises: [
                  { name: 'Przysiad ze sztangą', sets: 4, reps: '8–10', rpe: 'RPE 7–8', rest: '2 min', notes: 'tempo 3-1-1' },
                  { name: 'Rumuński martwy ciąg (RDL) ze sztangą', sets: 4, reps: '10', rpe: 'RPE 7', rest: '2 min' },
                  { name: 'Wykrok w przód z hantlami', sets: 3, reps: '10/nogę', rpe: 'RPE 7', rest: '90 s' },
                  { name: 'Leg curl (maszyna)', sets: 3, reps: '12', rpe: 'RPE 8', rest: '60 s', notes: 'akcent dwugłowy uda' }
                ]
              },
              {
                name: 'BLOK B — Góra (push)',
                exercises: [
                  { name: 'Wyciskanie sztangi na ławce poziomej', sets: 3, reps: '10', rpe: 'RPE 7', rest: '90 s' },
                  { name: 'Wyciskanie hantli nad głowę (OHP siedząc)', sets: 3, reps: '10', rpe: 'RPE 7', rest: '90 s' }
                ]
              },
              {
                name: 'BLOK C — Core + szyja / kark',
                exercises: [
                  { name: 'Deska klasyczna', sets: 3, reps: '40 s', rpe: 'RPE 7', rest: '45 s' },
                  { name: 'Pallof press (wyciąg dolny)', sets: 3, reps: '10/stronę', rpe: 'RPE 7', rest: '45 s' },
                  { name: 'Most karkowy (przód/tył/boki)', sets: 3, reps: '20 s × 3 poz.', rpe: 'RPE 6', rest: '45 s', notes: 'izometria' }
                ]
              }
            ]
          },
          // ── Trening B — siłownia (hinge-dominant) ───
          {
            id: 'pl-1-B', letter: 'B', title: 'Trening B — Siłownia (pull)', type: 'strength', frequency: '1× w tygodniu',
            description: 'Sesja siłowa z dominacją zawiasu biodrowego + pull (plecy) + core anty-rotacja.',
            duration: '70–80 min',
            sections: [
              {
                name: 'Aktywacja / mobilizacja (10 min)',
                exercises: [
                  { name: 'Trucht + ABC', sets: 1, reps: '5 min', rpe: 'RPE 5' },
                  { name: 'Hip CARs (krążenia bioder)', sets: 1, reps: '5/stronę' },
                  { name: 'Scapular pull-ups / dead hang', sets: 2, reps: '8', rest: '30 s' }
                ]
              },
              {
                name: 'BLOK A — Dolne partie (dominacja zawiasu biodrowego)',
                exercises: [
                  { name: 'Martwy ciąg klasyczny / sumo', sets: 4, reps: '6–8', rpe: 'RPE 7–8', rest: '2–3 min', notes: 'tempo 2-1-1' },
                  { name: 'Bułgarski przysiad z hantlami', sets: 4, reps: '8/nogę', rpe: 'RPE 8', rest: '90 s' },
                  { name: 'Hip thrust ze sztangą', sets: 3, reps: '10', rpe: 'RPE 8', rest: '90 s' },
                  { name: 'Calf raise stojąc (suwnica / hantel)', sets: 4, reps: '12', rpe: 'RPE 8', rest: '60 s' }
                ]
              },
              {
                name: 'BLOK B — Góra (pull)',
                exercises: [
                  { name: 'Podciąganie nachwytem (lub lat pulldown)', sets: 4, reps: '8', rpe: 'RPE 8', rest: '90 s' },
                  { name: 'Wiosłowanie sztangą w opadzie', sets: 3, reps: '10', rpe: 'RPE 7', rest: '90 s' },
                  { name: 'Face pull (linka)', sets: 3, reps: '15', rpe: 'RPE 7', rest: '45 s', notes: 'zdrowie barków' }
                ]
              },
              {
                name: 'BLOK C — Core anty-rotacja + skośne',
                exercises: [
                  { name: 'Side plank z uniesieniem nogi', sets: 3, reps: '10/stronę', rpe: 'RPE 7', rest: '45 s' },
                  { name: 'Russian twist z talerzem', sets: 3, reps: '20', rpe: 'RPE 7', rest: '45 s', notes: '5–10 kg' },
                  { name: 'Hanging knee raise (z drążka)', sets: 3, reps: '12', rpe: 'RPE 7', rest: '60 s' }
                ]
              }
            ]
          },
          // ── Bieg — tempo runs ──────────────────────
          {
            id: 'pl-1-BIEG', letter: 'C', title: 'Bieg — Tempo Runs', type: 'running', frequency: '1× w tygodniu',
            description: 'Sesja biegowa z naciskiem na bazę tlenową. Tempo bliskie progowi tlenowemu.',
            duration: '50–60 min',
            sections: [
              {
                name: 'Rozgrzewka (12 min)',
                exercises: [
                  { name: 'Trucht swobodny', sets: 1, reps: '8 min', rpe: 'RPE 5' },
                  { name: 'Pełen ABC + krok dostawny', sets: 2, reps: '20 m każdy', rpe: 'RPE 5', rest: '20 s' },
                  { name: 'Przyspieszenia narastające', sets: 3, reps: '40 m (60→85%)', rpe: 'RPE 7', rest: '60 s' }
                ]
              },
              {
                name: 'Część główna — TEMPO RUNS (baza tlenowa)',
                exercises: [
                  { name: 'Bieg 400 m @ 70–75% maks.', sets: 6, reps: '400 m', rpe: 'RPE 7', rest: '90 s trucht', notes: 'próg tlenowy' }
                ]
              },
              {
                name: 'Wyciszenie',
                exercises: [
                  { name: 'Trucht regeneracyjny', sets: 1, reps: '8 min', rpe: 'RPE 3' },
                  { name: 'Rozciąganie statyczne + oddychanie', sets: 1, reps: '6 min' }
                ]
              }
            ]
          },
          // ── Regeneracja aktywna ────────────────────
          {
            id: 'pl-1-REG', letter: 'R', title: 'Regeneracja aktywna', type: 'running', frequency: '1× w tygodniu',
            description: 'Aktywna regeneracja: niska intensywność + mobilność + oddech.',
            duration: '55–65 min',
            sections: [
              {
                name: 'Aktywność niskiej intensywności (40–50 min)',
                exercises: [
                  { name: 'Rower / pływanie / długi spacer', sets: 1, reps: '30–40 min', rpe: 'RPE 3–4' }
                ]
              },
              {
                name: 'Mobilność (15 min)',
                exercises: [
                  { name: 'Hip flow (rozciąganie bioder)', sets: 2, reps: '3 min' },
                  { name: 'Mobilizacja klatki piersiowej + odcinka piersiowego', sets: 2, reps: '2 min' },
                  { name: 'Rolowanie ud, pośladków, łydek', sets: 1, reps: '10 min' },
                  { name: 'Oddychanie przeponowe / box breathing', sets: 1, reps: '5 min' }
                ]
              }
            ]
          }
        ]
      },

      // ═══ FAZA 2 (tyg. 4-6) — SIŁA MAKSYMALNA ═══════════
      {
        num: 2, name: 'Faza 2', weeks: 3,
        focus: 'Siła maksymalna',
        description: 'Cięższe ciężary, mniej powtórzeń (3–5), wyższe RPE (8–9). Buduje bazę siłową pod fazę mocy.',
        workouts: [
          // ── Trening A — siła maksymalna (squat) ────
          {
            id: 'pl-2-A', letter: 'A', title: 'Trening A — Siła max (przysiad)', type: 'strength', frequency: '1× w tygodniu',
            description: 'Siła maksymalna z naciskiem na przysiad. Pełne przerwy, ciężkie podejścia.',
            duration: '75–85 min',
            sections: [
              {
                name: 'Aktywacja / mobilizacja (10 min)',
                exercises: [
                  { name: 'Rower / trucht', sets: 1, reps: '5 min', rpe: 'RPE 5' },
                  { name: 'Mobilizacja stawu skokowego + bioder', sets: 1, reps: '2 min' },
                  { name: 'Glute bridge + pompka', sets: 2, reps: '10', rest: '30 s', notes: 'aktywacja' }
                ]
              },
              {
                name: 'BLOK A — Siła maksymalna (przysiad)',
                exercises: [
                  { name: 'Przysiad ze sztangą', sets: 5, reps: '5', rpe: 'RPE 8', rest: '3 min', notes: 'tempo 2-1-X' },
                  { name: 'Front squat ze sztangą', sets: 3, reps: '6', rpe: 'RPE 8', rest: '2 min' }
                ]
              },
              {
                name: 'BLOK B — Wsparcie dolne',
                exercises: [
                  { name: 'Walking lunge ze sztangą na karku', sets: 3, reps: '8/nogę', rpe: 'RPE 8', rest: '90 s' },
                  { name: 'Nordic ham curl', sets: 4, reps: '5', rpe: 'RPE 9', rest: '90 s', notes: 'kontrolowane opuszczanie' }
                ]
              },
              {
                name: 'BLOK C — Góra (push, siła)',
                exercises: [
                  { name: 'Wyciskanie sztangi na ławce poziomej', sets: 5, reps: '5', rpe: 'RPE 8', rest: '2–3 min' },
                  { name: 'Pompki z talerzem na plecach', sets: 3, reps: '8', rpe: 'RPE 8', rest: '90 s', notes: '8–15 kg' }
                ]
              },
              {
                name: 'BLOK D — Core sportowy',
                exercises: [
                  { name: 'Weighted plank (talerz na plecach)', sets: 3, reps: '30 s', rpe: 'RPE 8', rest: '60 s' },
                  { name: 'Pallof press z pauzą 2 s', sets: 3, reps: '8/stronę', rpe: 'RPE 7', rest: '45 s' },
                  { name: 'Wzmocnienie karku (taśma/maszyna)', sets: 3, reps: '12 × 4 poz.', rpe: 'RPE 7', rest: '45 s' }
                ]
              }
            ]
          },
          // ── Trening B — siła maksymalna (hinge) ────
          {
            id: 'pl-2-B', letter: 'B', title: 'Trening B — Siła max (zawias)', type: 'strength', frequency: '1× w tygodniu',
            description: 'Siła maksymalna z naciskiem na zawias biodrowy + pull. Jednostronność dla piłkarza.',
            duration: '75–85 min',
            sections: [
              {
                name: 'Aktywacja / mobilizacja (10 min)',
                exercises: [
                  { name: 'Trucht + ABC + 2 przyspieszenia 70%', sets: 1, reps: '5–7 min', rpe: 'RPE 6' },
                  { name: 'Hip flow + scapular pull-ups', sets: 1, reps: '2 min' }
                ]
              },
              {
                name: 'BLOK A — Siła maksymalna (zawias biodrowy)',
                exercises: [
                  { name: 'Martwy ciąg klasyczny', sets: 5, reps: '3–5', rpe: 'RPE 8–9', rest: '3 min' },
                  { name: 'Hip thrust ze sztangą', sets: 4, reps: '6', rpe: 'RPE 8', rest: '2 min', notes: 'pauza 1 s w górze' }
                ]
              },
              {
                name: 'BLOK B — Jednostronność (przewaga dla piłkarza)',
                exercises: [
                  { name: 'Single leg RDL z hantlami', sets: 3, reps: '6/nogę', rpe: 'RPE 8', rest: '90 s' },
                  { name: 'Step-up z hantlami (ławka 50 cm)', sets: 3, reps: '6/nogę', rpe: 'RPE 8', rest: '90 s' }
                ]
              },
              {
                name: 'BLOK C — Góra (pull, siła)',
                exercises: [
                  { name: 'Podciąganie z dociążeniem', sets: 5, reps: '5', rpe: 'RPE 8', rest: '2 min', notes: 'talerz w pasie' },
                  { name: 'Pendlay row (wiosło z podłogi)', sets: 4, reps: '5', rpe: 'RPE 8', rest: '2 min' },
                  { name: 'Face pull', sets: 3, reps: '15', rpe: 'RPE 7', rest: '45 s', notes: 'zdrowie barków' }
                ]
              },
              {
                name: 'BLOK D — Core + szyja',
                exercises: [
                  { name: 'Ab wheel rollout (lub na kolanach)', sets: 3, reps: '8', rpe: 'RPE 8', rest: '60 s' },
                  { name: 'Side plank z dociążeniem (hantel 5 kg)', sets: 3, reps: '20 s/stronę', rpe: 'RPE 8', rest: '45 s' },
                  { name: 'Most karkowy (wszystkie kierunki)', sets: 3, reps: '30 s × 4 poz.', rpe: 'RPE 7', rest: '45 s' }
                ]
              }
            ]
          },
          // ── Bieg — interwał intensywny ─────────────
          {
            id: 'pl-2-BIEG', letter: 'C', title: 'Bieg — Interwał VO2max', type: 'running', frequency: '1× w tygodniu',
            description: 'Interwał intensywny w okolicach VO2max. Buduje pułap tlenowy.',
            duration: '50–55 min',
            sections: [
              {
                name: 'Rozgrzewka (12 min)',
                exercises: [
                  { name: 'Trucht swobodny', sets: 1, reps: '6 min', rpe: 'RPE 5' },
                  { name: 'Pełen ABC', sets: 2, reps: '20 m', rpe: 'RPE 5', rest: '20 s' },
                  { name: 'Przyspieszenia narastające', sets: 4, reps: '40 m (60→90%)', rpe: 'RPE 8', rest: '60 s' }
                ]
              },
              {
                name: 'Część główna — INTERWAŁ INTENSYWNY (VO2max)',
                exercises: [
                  { name: 'Bieg 200 m @ 85–90% maks.', sets: 8, reps: '200 m', rpe: 'RPE 9', rest: '75 s trucht' }
                ]
              },
              {
                name: 'Wyciszenie',
                exercises: [
                  { name: 'Trucht regeneracyjny + chód', sets: 1, reps: '8 min', rpe: 'RPE 3' },
                  { name: 'Rozciąganie statyczne', sets: 1, reps: '5 min' }
                ]
              }
            ]
          }
        ]
      },

      // ═══ FAZA 3 (tyg. 7-8) — MOC / SZYBKOŚĆ ════════════
      {
        num: 3, name: 'Faza 3', weeks: 2,
        focus: 'Moc / Szybkość / Zwinność',
        description: 'Konwersja siły w moc. Trening kontrastowy, plyometria reaktywna, sprinty maksymalne. Peak motoryczny przed sezonem.',
        workouts: [
          // ── Trening A — kontrast siła → moc ────────
          {
            id: 'pl-3-A', letter: 'A', title: 'Trening A — Kontrast (przysiad → moc)', type: 'strength', frequency: '1× w tygodniu',
            description: 'Trening kontrastowy: ciężka seria siłowa → natychmiast eksplozywny plyometric. Maksymalna moc.',
            duration: '75–90 min',
            sections: [
              {
                name: 'Aktywacja / pobudzenie CNS (12 min)',
                exercises: [
                  { name: 'Trucht + ABC + skipy wysokie', sets: 1, reps: '2×20 m', rpe: 'RPE 6' },
                  { name: 'Przyspieszenia narastające', sets: 3, reps: '30 m (60→80→90%)', rpe: 'RPE 8', rest: '60 s' },
                  { name: 'Pogo jumps + clap push-ups', sets: 2, reps: '10 + 5', rpe: 'RPE 7', rest: '60 s' }
                ]
              },
              {
                name: 'BLOK A — Trening kontrastowy (siła → moc)',
                exercises: [
                  { name: 'Przysiad ze sztangą', sets: 5, reps: '3 @ 80%', rpe: 'RPE 8', notes: 'eksplozywne wstawanie' },
                  { name: '→ natychmiast: Squat jump (masa ciała)', sets: 5, reps: '5', rpe: 'RPE 9', rest: '2–3 min po parze' }
                ]
              },
              {
                name: 'BLOK B — Plyometria reaktywna',
                exercises: [
                  { name: 'Depth jump z 40–50 cm', sets: 5, reps: '3', rpe: 'RPE 9', rest: '2 min' },
                  { name: 'Broad jump → sprint 5 m', sets: 5, reps: '3', rpe: 'RPE 9', rest: '2 min' },
                  { name: 'Skoki na podwyższenie (60–70 cm)', sets: 4, reps: '4', rpe: 'RPE 8', rest: '90 s' }
                ]
              },
              {
                name: 'BLOK C — Góra (moc)',
                exercises: [
                  { name: 'Wyciskanie sztangi (eksplozywne)', sets: 5, reps: '3', rpe: 'RPE 7', rest: '2 min', notes: '60% 1RM' },
                  { name: 'Med ball chest pass (do ściany)', sets: 4, reps: '6', rpe: 'RPE 8', rest: '90 s', notes: '3–5 kg' }
                ]
              },
              {
                name: 'BLOK D — Core eksplozywny',
                exercises: [
                  { name: 'Med ball slam', sets: 3, reps: '8', rpe: 'RPE 8', rest: '60 s', notes: '5–8 kg' },
                  { name: 'Hollow hold + rotacja', sets: 3, reps: '20 s + 10 rot.', rpe: 'RPE 8', rest: '60 s' }
                ]
              }
            ]
          },
          // ── Trening B — kontrast zawias + COD ──────
          {
            id: 'pl-3-B', letter: 'B', title: 'Trening B — Kontrast + Zwinność (COD)', type: 'strength', frequency: '1× w tygodniu',
            description: 'Trening kontrastowy zawiasu + lateralna moc + zwinność. Realna szybkość zmiany kierunku.',
            duration: '75–90 min',
            sections: [
              {
                name: 'Aktywacja / pobudzenie CNS (12 min)',
                exercises: [
                  { name: 'Trucht + dynamic stretch + ABC', sets: 1, reps: '3 min', rpe: 'RPE 6' },
                  { name: 'Drabinka koordynacyjna (różne wzorce)', sets: 4, reps: '30 s', rpe: 'RPE 7', rest: '30 s' },
                  { name: 'Starty z różnych pozycji (3 m)', sets: 4, reps: '1', rpe: 'RPE 8', rest: '60 s' }
                ]
              },
              {
                name: 'BLOK A — Trening kontrastowy (zawias → moc)',
                exercises: [
                  { name: 'Hip thrust eksplozywne', sets: 5, reps: '3', rpe: 'RPE 7', notes: '60% 1RM' },
                  { name: '→ natychmiast: Broad jump', sets: 5, reps: '3', rpe: 'RPE 9', rest: '2–3 min po parze' }
                ]
              },
              {
                name: 'BLOK B — Jednonóż / lateralna moc',
                exercises: [
                  { name: 'Bułgarski przysiad eksplozywny (hantle 50%)', sets: 4, reps: '5/nogę', rpe: 'RPE 8', rest: '90 s' },
                  { name: 'Lateral bound (skok boczny na odległość)', sets: 4, reps: '5/stronę', rpe: 'RPE 9', rest: '90 s' },
                  { name: 'Single leg hop (skoki na jednej nodze)', sets: 3, reps: '5/nogę', rpe: 'RPE 8', rest: '90 s' }
                ]
              },
              {
                name: 'BLOK C — Zwinność / COD (Change of Direction)',
                exercises: [
                  { name: 'Test 5-10-5 (pro agility, na czas)', sets: 4, reps: '1 powt.', rpe: 'RPE 10', rest: '2 min' },
                  { name: 'T-test (4 punkty, 5 m między)', sets: 3, reps: '1 powt.', rpe: 'RPE 10', rest: '2 min' },
                  { name: 'Reakcyjne starty (na sygnał, 5 m)', sets: 5, reps: '1 powt.', rpe: 'RPE 10', rest: '90 s' }
                ]
              },
              {
                name: 'BLOK D — Core + szyja',
                exercises: [
                  { name: 'Med ball rotational throw (do ściany)', sets: 3, reps: '6/stronę', rpe: 'RPE 8', rest: '60 s' },
                  { name: 'Plank z pociągnięciem hantla (renegade row)', sets: 3, reps: '8/stronę', rpe: 'RPE 7', rest: '60 s' },
                  { name: 'Wzmocnienie karku (taśma/maszyna)', sets: 3, reps: '15 × 4 poz.', rpe: 'RPE 7', rest: '45 s' }
                ]
              }
            ]
          },
          // ── Bieg — sprinty maks. + RSA ──────────────
          {
            id: 'pl-3-BIEG', letter: 'C', title: 'Bieg — Sprinty MAKS + RSA', type: 'running', frequency: '1× w tygodniu',
            description: 'Sprinty maksymalne z pełną regeneracją + Repeated Sprint Ability. Peak prędkości.',
            duration: '55–65 min',
            sections: [
              {
                name: 'Rozgrzewka (15 min)',
                exercises: [
                  { name: 'Trucht swobodny', sets: 1, reps: '6 min', rpe: 'RPE 5' },
                  { name: 'Pełen ABC + skipy wysokie', sets: 2, reps: '20 m', rpe: 'RPE 6' },
                  { name: 'Przyspieszenia narastające', sets: 5, reps: '40 m (60→95%)', rpe: 'RPE 8', rest: '60 s' },
                  { name: 'Starty z różnych pozycji', sets: 3, reps: '10 m', rpe: 'RPE 9', rest: '60 s' }
                ]
              },
              {
                name: 'Część główna — SPRINTY MAKS. (czysta szybkość)',
                exercises: [
                  { name: 'Sprint MAKS 30 m', sets: 6, reps: '30 m', rpe: 'RPE 10', rest: '3 min', notes: 'pełna regeneracja' }
                ]
              },
              {
                name: 'Część główna — RSA (powtórzeniowa szybkość)',
                exercises: [
                  { name: 'Sprint 30 m + trucht powrót', sets: 10, reps: '30 m', rpe: 'RPE 9', rest: '30 s', notes: 'po 5 min przerwy między blokami' }
                ]
              },
              {
                name: 'Wyciszenie',
                exercises: [
                  { name: 'Trucht + chód', sets: 1, reps: '10 min', rpe: 'RPE 3' },
                  { name: 'Rozciąganie statyczne + oddech 4-7-8', sets: 1, reps: '8 min' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

// Helper functions
const PlanContent = {
  get(planId) { return PLAN_CONTENT[planId] || null; },
  hasBuiltIn(planId) { return planId === 'plan1' || planId === 'plan2' || planId === 'plan_letni'; },
  getWorkout(planId, phaseNum, workoutLetter) {
    const p = PLAN_CONTENT[planId];
    if (!p) return null;
    const phase = p.phases.find(ph => ph.num === phaseNum);
    if (!phase) return null;
    return phase.workouts.find(w => w.letter === workoutLetter) || null;
  },
  totalWorkoutsInPhase(planId, phaseNum) {
    const phase = PLAN_CONTENT[planId]?.phases.find(ph => ph.num === phaseNum);
    if (!phase) return 0;
    // weekly: workouts marked with frequency multiplier
    let total = 0;
    phase.workouts.forEach(w => {
      const freq = w.frequency ? parseInt(w.frequency.match(/\d/)[0]) || 1 : 1;
      total += freq * phase.weeks;
    });
    return total;
  },
  ytSearchUrl(exerciseName) {
    const q = encodeURIComponent(exerciseName + ' tutorial');
    return 'https://www.youtube.com/results?search_query=' + q;
  }
};
