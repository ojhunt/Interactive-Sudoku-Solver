const VALID_JIGSAW_LAYOUTS = [
  // From https://www.sudokuwiki.org/js/jigsaw3.js?ver2.12e
  "111222333111222333111222333444555666444555666444555666777888999777888999777888999", // 0 = SUDOKU
  "111222233111222233114452333144455633444555666774556669777856699778888999778888999",
  "111222223111222233111555333444453336444456666477756666777555999778888999788888999",
  "111222233111442233111442233554444233555466663755566699777566999777888889778888999",
  "111122233111222333411222333444555663444555666744555666777888996777888999778889999",
  "111222223411222323441155333441155333444555599664665999666677799888677799888888777",
  "112222222112333332111133336441555566444456666445555966477779999877777899888888899",
  "115558888411555888441155588444117777944213377994223377996622337996662233996666223",
  "122223444112223344111223444151133384555663388555667778559667778999966788999967788",
  "112222233111222333411123336441555366444555666447555966477789996777888999778888899", //  9, moonlotus, moonlotus1016@hotmail.com, 25/01/2006, and Leonid Kreysin, Rebecca Schwartz
  "111112222113345522133444552134444452637777752633777559638878859668888899666699999", // 10, Onion, Andrew Smith, andrewgsmith@ntlworld.com, 15/01/2006
  "111152222111555222175555582177999882777999888477999883476666683444666333444463333", // 11, Double Mirror, Fer van Nieuwenhuizen, TeachOffice@Wanadoo.nl
  "111222333111123333411222336445525566444525666444555666777789999777888999778888899", // 12, cyndie.smith@netzero.com
  "111123333111224333122244443125544443225555566788885569788886669777866999777769999", // 13, Tornado, Kathleen R Nicol, kath@nic01.com
  "188888996118889966411899666441199667444119677443322777433352277333555227355555222", // 14, Cross, Andrew Smith, andrewgsmith@ntlworld.com
  "112222333111225333112225633114455663444456666744556699774588899777588999777888899", // 15, Worm, Leonid Kreysin, lkreysin@yahoo.com
  "444455555444435556994233566991223336911222336911122366998112766988817777888887777", // 16, Cabbage, Tim Cieplowski, tjciepl@bgnet.bgsu.edu
  "111222333111222333411522633441552663444555666744855966774885996777888999777888999", // 17, Stripes, leob, leob54321@yahoo.com
  "111223333112223633112225633411525666444555666444585996774588899774788899777788999", // 18, H, Bob & Debbie Scott, krydak@yahoo.com
  "111222223111122233441152333444555633744456663774555666777859966778889999788888999", // 19, Wednesday, G�rard Coteau, coteau41@wanadoo.fr
  "111123333114122333144522236144552236447555266487755669487775669888779699888879999", // 20 zigzag, G�rard Coteau, coteau41@wanadoo.fr
  "112223344111233334112223344155255344165258449665558899666788889667778899677777999", // Legoman Offside
  "111112222166511132665544432655448832654478332654778392654788399657789339777889999", // Anon 1
  "112222233112444233112444233116444833516678839556777899556678899556777899556678899", // Tim Tang
  "112222334112223334111233344115237444555667744555667779855667779886669999888888999", // 24
  "111122222113344422133344442133555442133555669788555669788886669778886699777779999", // 25
  "111123334111523334115523334555522444556622244666662994777668999777888899777888899", // 26
  "111122333111122233144442233445452233445555599665658999666668899677778889777778889", // 27
  "122223333112222333112456663114455663144455566174455669777458899777888999778888999", // 28
  "111112222133411152334466652344667752346687552346887592346877599348879559888779999", // 8 clue jigsaw
];

const INVALID_JIGSAW_LAYOUTS = [
   // http://forum.enjoysudoku.com/jigsaw-layouts-generate-test-t35712.html#p274998
  '000000001223411101223415111223455556223444566233334566777374566787774566788888888',
  '000000001222304111222344111222344411555333444665553777666553777666583777688888888',
];
