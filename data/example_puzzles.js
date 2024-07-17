const DISPLAYED_EXAMPLES = [
  {
    name: 'Classic sudoku',
    src: 'https://en.wikipedia.org/wiki/Sudoku#/media/File:Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg',
    input:
      '.~R1C1_5~R1C2_3~R1C5_7~R2C1_6~R2C4_1~R2C5_9~R2C6_5~R3C2_9~R3C3_8~R3C8_6~R4C1_8~R4C5_6~R4C9_3~R5C1_4~R5C4_8~R5C6_3~R5C9_1~R6C1_7~R6C5_2~R6C9_6~R7C2_6~R7C7_2~R7C8_8~R8C4_4~R8C5_1~R8C6_9~R8C9_5~R9C5_8~R9C8_7~R9C9_9',
    solution: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
  },
  {
    name: 'Thermosudoku',
    src: 'https://www.youtube.com/watch?v=lgJYOuVk910',
    input:
      '.~R1C2_4~R1C8_1~R2C1_2~R2C9_6~R8C1_9~R8C9_2~R9C2_1~R9C8_9.Thermo~R9C4~R8C3~R7C2~R6C1~R5C2~R4C3.Thermo~R4C1~R3C2~R2C3~R1C4~R2C5~R3C6.Thermo~R1C6~R2C7~R3C8~R4C9~R5C8~R6C7.Thermo~R6C9~R7C8~R8C7~R9C6~R8C5~R7C4',
    solution: '847632519295471386631598247129743865486259173753816924368924751974185632512367498',
  },
  {
    name: 'Killer sudoku',
    src: 'https://en.wikipedia.org/wiki/Killer_sudoku#/media/File:Killersudoku_color.svg',
    input:
      '.Cage~3~R1C1~R1C2.Cage~15~R1C3~R1C4~R1C5.Cage~25~R2C1~R2C2~R3C1~R3C2.Cage~17~R2C3~R2C4.Cage~9~R3C3~R3C4~R4C4.Cage~22~R1C6~R2C5~R2C6~R3C5.Cage~4~R1C7~R2C7.Cage~16~R1C8~R2C8.Cage~15~R1C9~R2C9~R3C9~R4C9.Cage~20~R3C7~R3C8~R4C7.Cage~8~R3C6~R4C6~R5C6.Cage~17~R4C5~R5C5~R6C5.Cage~20~R5C4~R6C4~R7C4.Cage~14~R4C2~R4C3.Cage~6~R4C1~R5C1.Cage~13~R5C2~R5C3~R6C2.Cage~6~R6C3~R7C2~R7C3.Cage~17~R4C8~R5C7~R5C8.Cage~27~R6C1~R7C1~R8C1~R9C1.Cage~8~R8C2~R9C2.Cage~16~R8C3~R9C3.Cage~10~R7C5~R8C4~R8C5~R9C4.Cage~12~R5C9~R6C9.Cage~6~R6C7~R6C8.Cage~20~R6C6~R7C6~R7C7.Cage~15~R8C6~R8C7.Cage~14~R7C8~R7C9~R8C8~R8C9.Cage~13~R9C5~R9C6~R9C7.Cage~17~R9C8~R9C9',
    solution: '215647398368952174794381652586274931142593867973816425821739546659428713437165289',
  },
  {
    name: 'Killer sudoku, hard',
    src: 'http://forum.enjoysudoku.com/killing-with-flowers-t36181-15.html#p279032',
    input: 'S<J<<O<<KJ^<<^<^>^^<N<<<J^Q^S^O>>^^^>^W^<<^>^^O^<<^T^J^^^>>>^>^>^ML<S<<^^>^<^<<^<',
    solution: '283197546967542813415368729591726384876439152324851967149275638752683491638914275',
  },
  {
    name: 'Arrow sudoku',
    src: 'http://sugarroad.blogspot.com/search/label/sudoku',
    input:
      '.Arrow~R1C5~R2C4~R3C3~R4C2~R5C1.Arrow~R3C7~R2C6~R3C5~R4C4~R5C3.Arrow~R6C2~R7C3~R6C4~R5C5~R4C6.Arrow~R7C4~R7C5~R7C6.Arrow~R6C7~R5C7~R4C7.Arrow~R5C9~R6C8~R7C7~R8C6~R9C5.~R1C2_6~R1C9_9~R2C1_9~R8C9_3~R9C1_4~R9C8_7',
    solution: '167584329985362417342719856718293645253647198694158732571936284829471563436825971',
  },
  {
    name: 'Anti-knight, Anti-consecutive',
    src: 'http://rishipuri.blogspot.com/2013/02/antiknight-nonconsecutive-sudoku-2013-2.html',
    input:
      '.AntiKnight.AntiConsecutive.~R3C4_4~R3C6_7~R4C3_6~R4C7_5~R6C3_4~R6C7_3~R7C4_2~R7C6_5',
    solution: '973518264425963718861427953316842597758396142294751386649275831182639475537184629',
  },
  {
    name: 'Little killer',
    src: 'https://www.youtube.com/watch?v=y4eKdI3ZJ78',
    input:
      '.~R3C2_5~R3C7_2~R5C4_3~R5C5_7.LittleKiller~22~R1C1.LittleKiller~28~R2C1.LittleKiller~26~R3C1.LittleKiller~23~R1C5.LittleKiller~34~R1C7.LittleKiller~40~R1C8.LittleKiller~42~R1C9',
    solution: '198235764427968531653714289732186945541379826986542173865421397279653418314897652',
  },
  {
    name: 'Sudoku X',
    src: 'http://forum.enjoysudoku.com/the-hardest-sudokus-new-thread-t6539-645.html',
    input:
      '.Diagonal~1.Diagonal~-1.~R1C3_1~R1C7_2~R2C3_2~R2C4_3~R2C9_4~R3C1_4~R4C1_5~R4C3_3~R4C8_6~R5C2_1~R5C9_5~R6C3_6~R7C5_7~R7C6_8~R8C5_9~R9C2_7~R9C6_1~R9C8_9',
    solution: '681945237792316584435827619523784961817639425946152873369478152158293746274561398',
  },
  {
    name: 'XV-kropki',
    src: 'https://www.youtube.com/watch?v=TT-6BfDeCdc',
    input: '.X~R2C1~R2C2.X~R3C1~R3C2.X~R1C8~R1C7.X~R2C7~R2C8.X~R7C8~R8C8.X~R7C9~R8C9.X~R8C3~R9C3.X~R8C2~R9C2.X~R5C4~R5C5.V~R8C2~R8C3.V~R8C8~R8C9.V~R2C1~R3C1.V~R1C7~R2C7.BlackDot~R2C5~R2C6.BlackDot~R4C6~R5C6.BlackDot~R5C6~R6C6.BlackDot~R3C1~R4C1.WhiteDot~R3C3~R3C2.WhiteDot~R4C3~R5C3.WhiteDot~R8C4~R8C5.WhiteDot~R8C6~R8C7.WhiteDot~R5C2~R6C2',
    solution: '195287463284536197376149825657912384918374256423658719532461978741895632869723541',
  },
  {
    name: 'Sandwich sudoku',
    src: 'https://www.youtube.com/watch?v=2wfR6QIvNn4&t=4s',
    input: '.Sandwich~8~C1.Sandwich~4~C2.Sandwich~17~C3.Sandwich~35~C4.Sandwich~14~C5.Sandwich~13~C6.Sandwich~3~C7.Sandwich~10~C8.Sandwich~25~C9.Sandwich~4~R1.Sandwich~33~R2.Sandwich~20~R3.Sandwich~17~R4.Sandwich~26~R5.Sandwich~10~R6.Sandwich~16~R7.Sandwich~24~R8.Sandwich~0~R9.~R3C3_1~R5C5_5~R7C7_9',
    solution: '236941875954378612871625439182439756397856124645217398413562987569783241728194563',
  },
  {
    name: 'German whispers',
    src: 'https://www.youtube.com/watch?v=nH3vat8z9uM',
    input: '.Whisper~R8C1~R7C1~R7C2~R8C3~R9C3~R9C2.Whisper~R9C6~R8C7~R7C7~R7C8~R6C9~R5C8.Whisper~R6C3~R5C2~R4C3~R3C4~R2C5~R1C6~R1C7~R2C8~R3C8~R4C7~R5C6~R6C6~R7C6~R8C5~R7C4.Whisper~R4C5~R4C6~R3C7.~R1C5_1~R2C2_5~R5C1_6~R5C9_9~R7C3_3~R8C8_3~R9C1_5~R9C5_3',
    solution: '796413852352689417184275693247591386615348279839762541923857164478126935561934728',
  },
  {
    name: 'International whispers',
    src: 'https://www.youtube.com/watch?v=5xu7OpQogfo',
    input: '.WhiteDot~R8C9~R9C9.WhiteDot~R7C9~R7C8.WhiteDot~R8C4~R8C5.WhiteDot~R5C2~R5C1.WhiteDot~R5C2~R6C2.WhiteDot~R6C6~R6C5.WhiteDot~R5C8~R5C7.WhiteDot~R2C4~R2C5.WhiteDot~R2C2~R2C1.Whisper~6~R1C2~R2C2~R3C2.Whisper~6~R2C1~R3C2~R4C3.Whisper~6~R2C3~R3C2~R4C1.Whisper~4~R7C2~R8C2~R9C2.Whisper~4~R8C1~R8C2~R8C3.Whisper~4~R9C1~R9C2~R9C3.Whisper~2~R9C7~R9C8~R8C8~R7C8~R6C8.Whisper~2~R7C7~R7C8~R8C9.Whisper~2~R8C7~R7C8~R6C9.Whisper~4~R4C7~R3C8~R4C9.Whisper~4~R3C8~R2C8~R1C8.Whisper~4~R1C7~R1C8~R1C9.Whisper~4~R2C7~R2C8~R2C9.Whisper~3~R4C5~R5C5~R6C5~R7C5.Whisper~3~R5C4~R5C5~R5C6.Whisper~3~R6C4~R5C5~R6C6.~R1C3_6~R4C4_3~R7C1_4~R9C9_2~R4C8_4',
    solution: '536971284897234516214856793768392145342518679951467328485123967629785431173649852',
  },
  {
    name: 'Renban',
    src: 'https://www.youtube.com/watch?v=XouRUgRsVSA',
    input: '.Renban~R4C8~R4C9~R5C9~R6C9.Renban~R7C9~R8C9~R9C9~R9C8.Renban~R6C7~R7C7~R8C7~R8C6.Renban~R2C6~R1C6~R1C5~R1C4.Renban~R2C1~R1C1~R1C2~R1C3.Renban~R2C3~R2C4~R3C4~R4C4.Renban~R5C5~R5C6~R6C6~R7C6.Renban~R5C4~R5C3~R6C3~R7C3.Renban~R3C1~R4C1~R5C1~R5C2.Renban~R7C1~R8C1~R9C1~R9C2.Renban~R7C4~R8C4~R9C4~R9C3.~R3C7_1.BlackDot~R2C9~R3C9.BlackDot~R1C7~R1C8.BlackDot~R3C6~R3C5.BlackDot~R4C7~R5C7',
    solution: '132769845496518723758342196815473269963285417274196358521937684389624571647851932',
  },
  {
    name: 'Between lines',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?chlang=en&id=0002KO',
    input: '.Between~R9C5~R8C6~R7C7~R6C8~R5C9.Between~R9C3~R8C4~R7C5~R6C6~R5C7~R4C8~R3C9.Between~R1C9~R2C8~R3C7~R4C6~R5C5~R6C4~R7C3~R8C2~R9C1.Between~R5C1~R4C2~R3C3~R2C4~R1C5.Between~R7C1~R6C2~R5C3~R4C4~R3C5~R2C6~R1C7.~R1C2_9~R2C1_2~R2C7_1~R4C3_6~R4C5_7~R4C8_5~R5C2_3~R5C8_8~R6C5_5~R6C7_2~R8C3_9~R8C9_8~R9C8_1',
    solution: '697531842258497163314862579846273951532149786971658234125386497469715328783924615',
  },
  {
    name: 'Lockout lines',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=000CM1',
    input: '.Lockout~4~R1C2~R2C2~R3C2~R4C2.Lockout~4~R4C2~R3C3~R2C3~R1C2.Lockout~4~R2C5~R2C4~R3C4~R3C5~R4C5~R4C4.Lockout~4~R4C6~R3C6~R2C6~R1C6~R2C7~R1C8~R2C8~R3C8~R4C8.Lockout~4~R6C3~R6C4~R7C4~R7C3~R8C3~R8C4.Lockout~4~R8C5~R8C6~R8C7~R7C6~R6C7~R6C6~R6C5.~R3C1_2~R3C9_8~R5C4_5~R6C1_3~R9C7_9~R9C2_1',
    solution: '563814729489752316271693548627189453148536297395427861934271685752968134816345972',
  },
  {
    name: 'Palindromes',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?chlang=en&id=0001WP',
    input: '.Palindrome~R7C1~R6C2~R5C1~R4C2~R3C3~R2C4~R1C5~R2C6~R1C7.Palindrome~R9C3~R8C4~R9C5~R8C6~R7C7~R6C8~R5C9~R4C8~R3C9.Palindrome~R7C4~R7C5~R7C6~R6C7~R5C7~R4C7.Palindrome~R3C6~R3C5~R3C4~R4C3~R5C3~R6C3.~R1C1_6~R1C9_5~R2C3_8~R2C5_5~R2C7_9~R4C1_8~R4C5_1~R4C9_3~R5C5_4~R6C5_2~R8C1_9~R8C3_7~R8C7_8~R8C9_2~R9C2_5~R9C8_6',
    solution: '694178235128453976375296481842619753719345628536827149283761594967534812451982367',
  },
  {
    name: 'Zipper lines',
    src: 'https://www.youtube.com/watch?v=qP_oxUzGD5g',
    input: '.Zipper~R1C2~R1C1~R2C1~R2C2~R3C2~R3C1~R4C1~R5C1~R4C2.Zipper~R2C3~R1C3~R1C4~R2C4~R3C4.Zipper~R2C6~R3C5~R3C6~R2C7~R1C6~R1C5.Zipper~R9C3~R8C2~R7C1~R6C1~R5C2~R4C3~R4C4~R5C4~R6C3.Zipper~R8C3~R7C3~R6C4~R6C5~R5C5~R4C5~R4C6~R5C6~R6C6~R6C7~R6C8~R6C9.Zipper~R5C7~R5C8~R4C7~R3C7~R2C8.Zipper~R7C5~R7C6~R8C6~R8C7~R7C7~R7C8~R7C9~R8C9~R9C9~R9C8~R9C7~R9C6~R9C5~R8C5.',
    solution: '354897126672451839189632574231564987597328641846719352415973268968245713723186495'
  },
  {
    name: 'Jigsaw',
    src: 'https://www.youtube.com/watch?v=wuduuLVGKDQ',
    input: '.NoBoxes.Jigsaw~000000021453303021453333221453322221455566121445666111445566667488887777888887777.~R1C1_3~R1C9_7~R2C1_1~R2C9_5~R3C5_6~R3C6_8~R4C3_5~R4C5_1~R4C6_9~R5C4_9~R6C9_2~R7C1_8~R7C6_3~R8C4_2~R8C5_3~R8C6_5~R8C9_1~R9C8_9',
    solution: '364891527189374265542168739625719843213987456937456182876523914498235671751642398',
  },
  {
    name: 'X-Windoku',
    src: 'http://forum.enjoysudoku.com/x-sudoku-extreme-t34714-30.html?hilit=windoku#p309418',
    input: '.Diagonal~1.Diagonal~-1.Windoku.~R1C8_1~R2C5_2~R2C9_3~R4C1_4~R4C6_3~R5C5_5~R5C9_6~R6C5_1~R7C6_7~R7C7_8~R8C5_6~R9C5_3~R9C6_2',
    solution: '932674518678521943541398267469283751217459386853716429326147895794865132185932674',
  },
  {
    name: 'Region sum lines',
    src: 'https://www.youtube.com/watch?v=7UZKP82Em14',
    input: '.RegionSumLine~R1C2~R2C2~R3C2~R4C2~R5C2.RegionSumLine~R1C3~R2C4~R3C5.RegionSumLine~R6C1~R7C1~R8C1.RegionSumLine~R7C2~R6C3~R5C4~R4C5~R3C6~R2C7~R1C8.RegionSumLine~R2C8~R3C7~R4C6~R5C5~R6C4~R7C3~R8C2.RegionSumLine~R3C8~R4C7~R5C6~R6C5~R7C4~R8C3~R9C2.RegionSumLine~R3C9~R4C8~R5C7~R6C6~R7C5~R8C4~R9C3.RegionSumLine~R5C9~R6C8~R7C7~R8C6~R9C5.',
    solution: '847925163965137284312468579693854712421376895758219346586743921274591638139682457',
  },
  {
    name: 'Sum lines, with loop',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=0009MN',
    input: '.SumLine~10~R1C3~R1C2~R1C1~R2C1~R3C1.SumLine~10~R3C4~R3C3~R3C2~R2C2~R2C3~R1C4.SumLine~10~R1C5~R1C6~R2C6~R3C6.SumLine~10~R1C7~R2C7~R3C7~R3C8~R3C9.SumLine~10~R4C4~R3C5~R4C6~R5C7.SumLine~10~R7C1~R6C1~R6C2~R6C3.SumLine~10~R8C2~R7C2~R7C3~R7C4.SumLine~10~R6C6~R7C5~R8C4~R9C3.SumLine~10~R9C5~R9C6~R8C6~R7C6.SumLine~10~R8C7~R7C8~R7C9~R6C8~R6C7.SumLine~10~R4C5~R5C6~R6C5~R5C4~LOOP.',
    solution: '582437619136592478479168532768241953925683147341975286297354861814726395653819724',
  },
  {
    name: 'Disjoint little killer',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?chlang=en&id=0006TM',
    input: '.DisjointSets.LittleKiller~62~R1C9.LittleKiller~33~R1C1.LittleKiller~12~R1C3.LittleKiller~14~R3C9.LittleKiller~21~R9C7.LittleKiller~36~R9C5.LittleKiller~8~R7C1.LittleKiller~9~R1C2.',
    solution: '325784169719625483684319725843297651592861347167543298478932516236158974951476832',
  },
  {
    name: 'Skyscraper',
    src: 'https://www.youtube.com/watch?v=rLlZA5ZND00',
    input: '.~R1C1_1~R1C6_2~R1C9_8~R3C1_3~R3C4_6~R3C7_4~R5C1_5~R5C3_2~R5C6_3~R7C1_7~R7C4_8~R7C7_2~R9C9_6~R9C6_4~R9C1_9.Skyscraper~c5~5.Skyscraper~r2~2.Skyscraper~r4~4.Skyscraper~r6~6.Skyscraper~r8~8',
    solution: '147932658826145937359678412678419325592783164413256789765891243234567891981324576',
  },
  {
    name: 'X-Sum',
    src: 'https://www.youtube.com/watch?v=fnCzYnsC4Ow',
    input: '.XSum~C2~27~27.XSum~C4~11~11.XSum~C6~21~0.XSum~C7~16~16.XSum~R2~8~8.XSum~R4~17~17.XSum~R6~30~30.XSum~R8~28~28.',
    solution: '856214379341975862792863541417529683985631724623487195274156938539748216168392457',
  },
  {
    name: 'Odd even',
    src: 'https://www.youtube.com/watch?v=Q7hhVgE8zGM',
    input: '.~R1C6_7~R1C7_2~R1C8_1~R1C9_6~R2C9_5~R2C8_7~R2C7_9~R2C6_4~R8C1_2~R8C2_7~R8C3_4~R8C4_5~R9C1_9~R9C2_5~R9C3_8~R9C4_2~R4C7_2_4_6_8~R4C8_2_4_6_8~R5C6_2_4_6_8~R6C6_2_4_6_8~R6C7_2_4_6_8~R6C8_2_4_6_8~R7C6_2_4_6_8~R8C7_2_4_6_8~R8C8_2_4_6_8~R2C3_1_3_5_7_9~R3C2_1_3_5_7_9~R4C4_1_3_5_7_9~R4C2_1_3_5_7_9~R5C4_1_3_5_7_9~R5C2_1_3_5_7_9~R3C4_1_3_5_7_9~R6C3_1_3_5_7_9',
    solution: '549837216823614975716925348635149827492786153187352469361478592274593681958261734',
  },
  {
    name: 'Odd-even thermo',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=0003V5',
    input: '.Binary~UFVQFUAFQAE~_Odd-Even%20Thermo~r1c2~r1c3~r1c4~r1c5~~r1c8~r1c9~r2c9~r3c9~~r2c8~r2c7~~r3c4~r3c3~~r3c2~r4c2~r4c1~~r6c3~r5c3~r5c4~r4c4~~r5c6~r4c6~r4c5~~r6c8~r6c9~r5c9~~r7r2~r7c3~~r7c8~r7c9~r8c9~~r8c2~r9c2~r9c1~~r8c4~r9c4~~r8c5~r9c5~r9c6',
    solution: '613798524298145736457362198971853642384621975562479813139286457726514389845937261',
  },
  {
    name: 'Double arrow',
    src: 'https://sudokupad.app/v2m1f8gtlp',
    input:
      '.DoubleArrow~R1C4~R1C5~R1C6~R1C7.DoubleArrow~R2C3~R2C4~R2C5~R2C6.DoubleArrow~R3C2~R3C3~R3C4~R3C5.DoubleArrow~R4C1~R4C2~R4C3~R4C4.DoubleArrow~R4C5~R5C5~R6C5.DoubleArrow~R6C6~R6C7~R6C8~R6C9.DoubleArrow~R7C5~R7C6~R7C7~R7C8.DoubleArrow~R8C4~R8C5~R8C6~R8C7.DoubleArrow~R9C3~R9C4~R9C5~R9C6.~R9C1_3~R4C1_1~R4C4_5~R3C2_2~R2C3_3~R1C4_4~R1C7_8~R2C6_7~R3C5_6~R6C6_9~R6C9_1~R7C5_8~R8C4_7~R9C3_6~R9C6_4~R8C7_4~R7C8_1',
    solution: '561493872493827165827165943142538697689271354735649281954382716218756439376914528',
  },
  {
    name: 'Pill arrow',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=0007D1',
    input: '.PillArrow~2~R1C3~R1C2~R1C1~R2C1~R3C1.PillArrow~2~R1C8~R1C7~R1C6~R1C5~R1C4.PillArrow~2~R2C7~R2C6~R2C5~R2C4~R2C3.PillArrow~2~R4C1~R5C1~R6C1~R7C1~R8C1.PillArrow~2~R3C2~R4C2~R5C2~R6C2~R7C2.PillArrow~2~R9C1~R9C2~R9C3~R9C4~R9C5.PillArrow~2~R5C9~R4C9~R3C9~R2C9~R1C9.PillArrow~2~R8C6~R9C6~R9C7~R9C8~R9C9.Arrow~R3C3~R4C4~R5C5.Arrow~R7C3~R6C4~R5C5~R4C6.Arrow~R3C8~R4C7.',
    solution: '514896237679231485328745196235684971491327658786159342967418523853962714142573869',
  },
  {
    name: 'Global entropy',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=0008G7',
    input: '.~R1C1_8~R1C9_7~R3C4_9~R3C6_5~R4C6_8~R4C4_6~R4C3_5~R6C3_6~R6C4_1~R7C4_7~R7C6_3~R6C6_9~R6C7_4~R4C7_9~R9C9_4~R9C1_2.GlobalEntropy',
    solution: '891234567534867291672915348315648972948372615726159483459783126183426759267591834',
  },
  {
    name: 'Quadruple X',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=00040T',
    input: '.Diagonal~1.Diagonal~-1..Quad~R1C1~1~4~6~7.Quad~R5C1~2~3.Quad~R6C1~1~2.Quad~R3C3~1~2~4~8.Quad~R6C3~3~5~8~9.Quad~R2C4~6~7.Quad~R7C5~3~6.Quad~R3C6~4~5~8~9.Quad~R6C6~2~3~6~7.Quad~R3C8~1~2.Quad~R4C8~1~5.Quad~R8C8~2~3~4~5',
    solution: '762384591415729368398165427654278913837691245129543786543812679971436852286957134',
  },
  {
    name: 'Nabner thermo',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=000EX5',
    input: '.Thermo~R3C2~R3C3~R3C4.Thermo~R3C7~R4C8~R5C7~R6C8.Thermo~R9C6~R8C6~R7C6.Thermo~R7C2~R8C2~R9C2.Thermo~R6C2~R7C3~R6C4~R7C5.WhiteDot~R9C7~R9C8.WhiteDot~R9C9~R9C8.BlackDot~R4C2~R5C2.BinaryX~8H-xf8H-xf8H-B~_Nabner~R4C1~R5C1~R6C1~R7C2~~R4C4~R5C4~R6C5~R6C6~~R2C4~R3C5~R3C6~R2C7~~R3C8~R4C9~R5C9~R6C9~~R6C8~R7C7~R7C8~R7C9~~R8C9~R8C8~R8C7~R9C6~~R3C2~R4C3~R5C3~R6C3.~R1C8_9',
    solution: '814576293379142586256938174741653829928417365563829741437295618182364957695781432',
  },
  {
    name: 'Modular lines',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=0009I1',
    input: '.Modular~3~R2C5~R2C4~R2C3~R2C2~R3C2~R4C2~R5C2.Modular~3~R7C1~R8C1~R8C2~R7C2.Modular~3~R4C3~R5C3~R6C3~R7C3~R8C3~R9C3~R9C2.Modular~3~R6C4~R5C4~R4C4~R4C5~R4C6~R5C6~R6C6.Modular~3~R5C8~R6C8~R7C8~R8C8~R8C7~R8C6~R8C5.Modular~3~R3C8~R2C8~R2C9~R3C9.Modular~3~R1C9~R1C8~R1C7~R2C7~R3C7~R4C7~R5C7~R6C7.Cage~21~R1C1~R1C2~R2C2~R2C1.Cage~22~R4C1~R5C1~R6C1.Cage~3~R4C4~R4C3.Cage~3~R6C3~R6C4.Cage~10~R6C5~R7C5~R8C5.Cage~22~R2C5~R3C5~R4C5.Cage~7~R4C6~R4C7.Cage~8~R6C6~R6C7.Cage~15~R4C9~R5C9~R6C9.Cage~13~R8C8~R8C9~R9C9~R9C8.',
    solution: '359427168764891523128356974972183456536974812841265397415632789293718645687549231',
  },
  {
    name: 'Entropic connections',
    src: 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?id=000EA3',
    input: '.Cage~9~R1C1~R2C1.Cage~20~R2C3~R3C3~R3C2.Cage~12~R1C9~R1C8.Cage~15~R2C7~R3C7~R3C8.Cage~20~R7C2~R7C3~R8C3.Cage~10~R9C1~R9C2.Cage~9~R8C9~R9C9.Cage~18~R7C8~R7C7~R8C7.Whisper~5~R9C1~R8C2~R7C3.Whisper~5~R4C2~R5C3~R6C2.Whisper~5~R1C1~R2C2~R3C3.Whisper~5~R7C7~R8C8~R9C9.Entropic~R3C1~R4C1~R5C1~R6C1~R7C1~R8C1.Entropic~R1C2~R1C3~R1C4~R1C5~R1C6~R1C7.Entropic~R2C9~R3C9~R4C9~R5C9~R6C9.Entropic~R9C8~R9C7~R9C6~R9C5~R9C4~R9C3~R9C2.Entropic~R6C8~R5C7~R4C6~R3C5~R2C4~R3C4~R4C4~R5C5~R6C4~R7C4~R8C4.Binary~EAEBEAAQAAAAE~_1%3A3~R2C6~R3C6.',
    solution: '642751839315986427978342561581493276263175948794268153459617382136824795827539614',
  },
  {
    name: 'Indexing',
    'src': 'https://www.youtube.com/watch?v=J0OVDew3Hg4',
    'input': '.~R2C2_4~R2C3_9~R2C4_7~R1C6_3~R1C8_5~R3C6_5~R3C7_1~R3C8_2~R4C2_2~R4C4_6~R5C3_7~R7C2_6~R7C3_3~R7C4_8~R6C6_8~R5C7_8~R6C8_6~R8C6_9~R8C7_5~R8C8_3~R9C2_7~R9C4_2.Indexing~C~R1C1~R2C1~R3C1~R4C1~R5C1~R6C1~R7C1~R8C1~R9C1~R1C5~R2C5~R3C5~R4C5~R5C5~R6C5~R7C5~R8C5~R9C5~R1C9~R2C9~R3C9~R4C9~R5C9~R6C9~R7C9~R8C9~R9C9',
    'solution': '216483957549712683738965124824697315657321849391548762963854271482179536175236498',
  },
  {
    name: 'Full rank',
    'src': 'https://logic-masters.de/Raetselportal/Raetsel/zeigen.php?chlang=en&id=000EDA',
    'input': '.FullRank~C2~26~.FullRank~C4~32~.FullRank~C6~6~.FullRank~C8~35~.FullRank~R1~17~.FullRank~R3~13~.FullRank~R5~10~.FullRank~R7~21~.FullRank~C3~~12.FullRank~C5~~19.FullRank~C7~~2.FullRank~C9~~14.FullRank~R8~~23.FullRank~R6~~20.FullRank~R4~~34.FullRank~R2~~11.',
    'solution': '576832491829514763431769852768125349354698217192473685615347928247981536983256174',
  },
  {
    name: 'Pencilmark sudoku',
    src: 'https://sudokupad.app/v7oVqMfjTs',
    input: '.~R1C1_1_2~R2C2_1_2_9~R2C4_1_3~R1C5_1_4_6~R2C5_8_9~R4C2_2_3~R5C2_7_9~R9C1_2_3~R7C3_8_9~R8C3_1_2_3_8_9~R6C3_6_7~R3C3_5_6_9~R4C4_3_4_5~R4C5_4_9~R5C5_6_7_8~R8C5_1_2~R7C4_4_6~R9C5_5_6~R1C6_6_9~R3C6_5_7~R4C6_6_9~R6C6_1_4_7~R8C6_1_8~R9C9_3_4_5~R8C8_2_8_9~R7C7_6_7_8~R6C8_4_8~R5C9_4_6~R4C7_5_6~R3C7_7_9~R2C8_1_2_3_5_8_9~R1C8_1_9~R1C9_1_3',
    solution: '278569413916384752435127968123496587894275136567831249759643821642718395381952674',
  },
  {
    name: '16x16',
    src: 'http://forum.enjoysudoku.com/symmertic-16x16-grid-t38266.html#p295157',
    input: `
      .Shape~16x16
      .~R1C4_5~R1C6_9~R1C7_10~R1Cb_2~R1Ce_15~R2C7_16~R2C8_3~R2C9_9~R2Cc_15~R2Cf_1~R2Cg_10~R3C2_13~R3C5_2~R3Ca_14~R3Cd_3~R3Ce_5~R3Cf_12~R3Cg_9~R4C1_12~R4C2_15~R4C7_4~R4C8_7~R4Cd_8~R4Cf_6~R5C1_1~R5C5_3~R5C7_2~R5C8_15~R5Cb_14~R5Cd_10~R5Ce_8~R6C5_1~R6Ca_10~R6Cf_7~R6Cg_16~R7C1_2~R7C4_3~R7C6_16~R7C7_12~R7Cb_8~R7Cc_4~R8C1_7~R8C3_5~R8C4_13~R8C6_10~R8C9_12~R8Ca_15~R9C1_10~R9C2_11~R9C5_9~R9C8_8~R9Ca_2~R9Cb_6~R9Cd_16~R9Ce_13~R9Cg_14~RaC2_7~RaC6_1~RaCb_9~RaCc_13~RbC4_9~RbC5_16~RbC6_13~RbCa_7~RbCd_2~RbCe_11~RbCg_1~RcC3_13~RcC4_6~RcC5_14~RcC9_10~RcCa_11~RcCb_3~RcCg_5~RdC1_5~RdC2_2~RdC4_16~RdCc_12~RdCf_11~RdCg_15~ReC2_4~ReC3_7~ReC9_6~ReCb_1~ReCd_14~RfC2_9~RfC5_12~RfC6_11~RfC8_14~RfCb_13~RfCc_2~RgC4_12~RgC7_7~RgC8_5~RgCd_6~RgCe_2~RgCf_3
    `,
    solution: 'FCPEMIJLAHBGKONDNHKBEFPCILDOMGAJDMJGBOHAKNPFCELILOIAKNDGCMJEHPFBAPDKCEBOGFNIJHMLILNHADKMBJECOFGPBJOCGPLFMAHDENIKGFEMHJNILOKPADBCJKLDIGCHEBFAPMONOGBNJAEKDPIMLCHFHECIPMFDOGLNBKJAPAMFNLOBJKCHGIDEEBHPFCMJNDGLIAKOMDGJOBIPFCAKNLEHCIFOLKANHEMBDJPGKNALDHGEPIOJFBCM',
  },
  {
    name: '16x16: Sudoku X, hard',
    src: 'http://forum.enjoysudoku.com/giant-sudokus-t39758-30.html#p321124',
    input: `
      .Shape~16x16
      .Diagonal~1.Diagonal~-1
      .~R1C1_1~R1C4_4~R1Ca_10~R1Cd_13~R1Ce_14~R2C5_9~R2C8_12~R2Ce_2~R2Cf_3~R3C1_9~R3C5_14~R3C7_15~R3Ca_2~R3Cd_6~R4C1_13~R4C4_15~R4C6_2~R4C8_4~R4Cc_7~R4Cd_9~R4Cf_11~R4Cg_12~R5C1_2~R5C2_1~R5C7_8~R5C8_6~R5Cg_15~R6C2_6~R6C3_8~R6C5_10~R6C7_9~R6Cf_4~R6Cg_3~R7C1_10~R7C6_16~R7C7_13~R7Cc_3~R7Cf_7~R8C7_4~R8C9_5~R8Ca_8~R8Cb_7~R8Cf_12~R8Cg_11~R9C1_3~R9Ca_12~R9Cb_9~R9Cc_11~R9Ce_16~RaC4_6~RaC5_11~RaC6_9~RaC8_10~RaCc_15~RbC2_12~RbC8_15~RbC9_3~RbCe_5~RcC1_16~RcC3_13~RcC8_3~RdC3_2~RdC5_8~RdC7_6~RdC9_12~RdCc_9~RdCd_16~RdCg_13~ReC1_8~ReC6_11~ReC7_10~ReC9_16~ReCc_13~ReCg_1~RfC3_10~RfC6_15~RfC7_14~RfC9_4~RfCb_2~RfCd_8~RgC3_14~RgC4_13~RgCb_6~RgCd_12
    `,
    solution: 'ABCDEFGHIJKLMNOPFEGHIJKLNMOPABCDIJKLNMOPABCDFHEGMNPOABCDFEHGIJKLBADCGEHFKILJNMPOEFHGJLIKOPMNBADCJILKOPMNBDACEFGHNMOPCADBEHGFJILKCDABFHEGJLIKOPMNGHEFKILJMNPOCDABKLIJMNPOCADBGEHFPOMNBDACGFEHKLIJDCBAHGFELKJIPONMHGFELKJIPONMDCBALKJIPONMDCBAHGFEOPNMDCBAHGFELKJI',
  },
  {
    name: '16x16: Jigsaw',
    src: 'http://forum.enjoysudoku.com/16x16-jigsaw-sudoku-t38676.html#p300550',
    input: `
      ..E..K..MI....P.K....P....L.MF.B....HM.D....O..FJI.....KG.DB.C.O.OD...NAE.HM.K..........P.I....GIF.HL.B....AC..JCE.P...L.M............I.O...P.HDN..IM....E.PB.DCD....G.P..........A.CI.OHF...JL.E.F.GA.HI.....OKF..N....A.PL....H.PJ.C....M....I.C....MI..K..G..
      AAAAABBBBBCDDDDDAAEAABBBBBCDDDDDAAEAAABBFCCDDDDGAAEBBBBFFCCCDDGGHHEEEEEEFCCCIGGGHHHEEEEEFFCCIGGGHHHHEFEFFICCIGGGHHHHHFFFIICCIIGGHJJHJJFFIIIIIIKGJJJJJFFLIIKKKKKGJJJJJJLLLLLKKKKKJMLLLLLLLNLLKKKKMMLMNNNNNNOPPPPKMMMMMNNOOOOOPPPPMMMMNNNOOOOOPPPPMMMNNNNOOOOOPPPP
    `,
    solution: 'OLECFKGBMIJHNDPAKNHADPCEJOLIMFGBGPIBHMADCNEJOLKFJIMLNHFKGPDBECAOBODGPFNAECHMJKILLDNEJOKCPAIFHMBGIFGHLDBMNKOACPEJCEJPABOLDMGKFINHMJCKELIFOBAGPNHDNAKIMJHGLEFPBODCDHBFOGJPKLNCIAMEPKAMCIEOHFBDGJLNEMFDGAPHIJCNLBOKFBONIEDJAGPLKHCMHGPJKCLNBDMOAEFIACLOBNMIFHKEDGJP',
  },
  {
    name: '16x16: Windoku',
    src: 'http://forum.enjoysudoku.com/16x16-windoku-t30028.html',
    input: `
      .Shape~16x16
      .Windoku
      .~R1C3_2~R2C3_6~R5C1_7~R5C2_2~R6C1_9~R7C2_13~R7C3_11~ReC1_4~RgC1_5~R7C4_4~R8C1_15~R9C2_16~RaC1_2~RbC3_8~RbC4_11~RcC4_12~R9C4_6~RfC4_15~RfC5_14~R8C5_12~R8C6_5~R6C5_13~R6C6_6~R4C5_1~R3C5_15~R3C6_3~R2C6_9~R9C7_15~RaC7_13~R3C8_14~R5C8_10~RfC8_1~RgC8_9~ReC9_6~RcC9_9~R9C9_4~R2C9_3~R7Ca_12~RaCa_8~R8Cb_8~R5Cb_4~R3Cb_5~R4Cc_4~R6Cc_10~R7Cc_7~R9Cc_1~RbCc_16~ReCc_9~RdCd_12~RcCd_7~R7Cd_3~R4Cd_15~R1Ce_3~R2Ce_10~R2Cf_16~R1Cg_1~R3Cf_7~R6Cf_2~RaCf_12~RbCf_6~RcCg_11
    `,
    solution: 'POBEGLFMKJNHDCIAALFGKIDECOBMHJPNHDIJOCPNLAEFBKGMKNCMAJBHGIPDOLEFGBEHPOKJMFDCAINLIALPMFCDONKJEGBHFMKDHANBELIGCOJPOJNCLEIGAPHBMFKDMPGFBNOCDKLAIEHJBEOAIKMFJHGNPDLCJIHKDGALBECPNMFONCDLJHEPIMFOGBAKCGPIFMJONBAKLHDEDHABEPLKFCOIJNMGLKMONBGAHDJEFPCIEFJNCDHIPGMLKAOB',
  },
  {
    name: '6x6',
    src: 'http://forum.enjoysudoku.com/6x6-su-dokus-how-hard-can-they-be-t2053.html',
    input: '.~R1C5_4~R2C2_1~R2C4_3~R2C6_5~R3C4_2~R4C3_3~R5C1_6~R5C3_2~R5C5_5~R6C2_5.Shape~6x6',
    solution: '325146416325541263263514632451154632',
  },
  {
    name: '6x6: Numbered rooms',
    'src': 'https://discord.com/channels/709370620642852885/721090566481510732/1253331176685568112',
    'input': '.NumberedRoom~C1~1~6.NumberedRoom~R1~1~6.NumberedRoom~C2~6~1.NumberedRoom~C3~1~3.NumberedRoom~C4~6~6.NumberedRoom~C5~3~1.NumberedRoom~C6~3~6.NumberedRoom~R2~3~1.NumberedRoom~R4~3~6.NumberedRoom~R5~3~1.NumberedRoom~R6~3~6.NumberedRoom~R3~1~3..Shape~6x6',
    'solution': '143562625143351426462315234651516234',
  },
];

// Index the puzzles by their name in puzzles.
const PUZZLE_INDEX = new Map(
  DISPLAYED_EXAMPLES.map(puzzle => [puzzle.name, puzzle]));