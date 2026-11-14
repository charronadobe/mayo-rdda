/* eslint-disable */
/* global WebImporter */

// <migrated-conditions> (generated from tools/importer/urls-condition.txt; keep self-contained)
const MIGRATED_CONDITION_URLS = new Set([
  'https://www.mayoclinic.org/diseases-conditions/abdominal-aortic-aneurysm/symptoms-causes/syc-20350688',
  'https://www.mayoclinic.org/diseases-conditions/acanthosis-nigricans/symptoms-causes/syc-20368983',
  'https://www.mayoclinic.org/diseases-conditions/achalasia/symptoms-causes/syc-20352850',
  'https://www.mayoclinic.org/diseases-conditions/achilles-tendinitis/symptoms-causes/syc-20369020',
  'https://www.mayoclinic.org/diseases-conditions/achilles-tendon-rupture/symptoms-causes/syc-20353234',
  'https://www.mayoclinic.org/diseases-conditions/acl-injury/symptoms-causes/syc-20350738',
  'https://www.mayoclinic.org/diseases-conditions/acne/symptoms-causes/syc-20368047',
  'https://www.mayoclinic.org/diseases-conditions/actinic-keratosis/symptoms-causes/syc-20354969',
  'https://www.mayoclinic.org/diseases-conditions/acute-lymphocytic-leukemia/symptoms-causes/syc-20369077',
  'https://www.mayoclinic.org/diseases-conditions/albinism/symptoms-causes/syc-20369184',
  'https://www.mayoclinic.org/diseases-conditions/alpha-1-antitrypsin-deficiency/symptoms-causes/syc-20588790',
  'https://www.mayoclinic.org/diseases-conditions/anal-cancer/symptoms-causes/syc-20354140',
  'https://www.mayoclinic.org/diseases-conditions/anorexia-nervosa/symptoms-causes/syc-20353591',
  'https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624',
  'https://www.mayoclinic.org/diseases-conditions/baby-acne/symptoms-causes/syc-20369880',
  'https://www.mayoclinic.org/diseases-conditions/back-pain/symptoms-causes/syc-20369906',
  'https://www.mayoclinic.org/diseases-conditions/bacterial-vaginosis/symptoms-causes/syc-20352279',
  'https://www.mayoclinic.org/diseases-conditions/bad-breath/symptoms-causes/syc-20350922',
  'https://www.mayoclinic.org/diseases-conditions/bags-under-eyes/symptoms-causes/syc-20369927',
  'https://www.mayoclinic.org/diseases-conditions/bakers-cyst/symptoms-causes/syc-20369950',
  'https://www.mayoclinic.org/diseases-conditions/balance-problems/symptoms-causes/syc-20350474',
  'https://www.mayoclinic.org/diseases-conditions/bardet-biedl-syndrome/symptoms-causes/syc-20586227',
  'https://www.mayoclinic.org/diseases-conditions/bartholin-cyst/symptoms-causes/syc-20369976',
  'https://www.mayoclinic.org/diseases-conditions/basal-cell-carcinoma/symptoms-causes/syc-20354187',
  'https://www.mayoclinic.org/diseases-conditions/bells-palsy/symptoms-causes/syc-20370028',
  'https://www.mayoclinic.org/diseases-conditions/binge-eating-disorder/symptoms-causes/syc-20353627',
  'https://www.mayoclinic.org/diseases-conditions/black-hairy-tongue/symptoms-causes/syc-20356077',
  'https://www.mayoclinic.org/diseases-conditions/breast-pain/symptoms-causes/syc-20350423',
  'https://www.mayoclinic.org/diseases-conditions/broken-hand/symptoms-causes/syc-20450240',
  'https://www.mayoclinic.org/diseases-conditions/broken-heart-syndrome/symptoms-causes/syc-20354617',
  'https://www.mayoclinic.org/diseases-conditions/bruxism/symptoms-causes/syc-20356095',
  'https://www.mayoclinic.org/diseases-conditions/bulimia/symptoms-causes/syc-20353615',
  'https://www.mayoclinic.org/diseases-conditions/bunions/symptoms-causes/syc-20354799',
  'https://www.mayoclinic.org/diseases-conditions/burning-mouth-syndrome/symptoms-causes/syc-20350911',
  'https://www.mayoclinic.org/diseases-conditions/c-difficile/symptoms-causes/syc-20351691',
  'https://www.mayoclinic.org/diseases-conditions/calciphylaxis/symptoms-causes/syc-20370559',
  'https://www.mayoclinic.org/diseases-conditions/cancer/symptoms-causes/syc-20370588',
  'https://www.mayoclinic.org/diseases-conditions/canker-sore/symptoms-causes/syc-20370615',
  'https://www.mayoclinic.org/diseases-conditions/carcinoma-unknown-primary/symptoms-causes/syc-20370683',
  'https://www.mayoclinic.org/diseases-conditions/cerebral-palsy/symptoms-causes/syc-20353999',
  'https://www.mayoclinic.org/diseases-conditions/chest-pain/symptoms-causes/syc-20370838',
  'https://www.mayoclinic.org/diseases-conditions/chickenpox/symptoms-causes/syc-20351282',
  'https://www.mayoclinic.org/diseases-conditions/childhood-obesity/symptoms-causes/syc-20354827',
  'https://www.mayoclinic.org/diseases-conditions/childhood-schizophrenia/symptoms-causes/syc-20354483',
  'https://www.mayoclinic.org/diseases-conditions/cholecystitis/symptoms-causes/syc-20364867',
  'https://www.mayoclinic.org/diseases-conditions/cholestasis-of-pregnancy/symptoms-causes/syc-20363257',
  'https://www.mayoclinic.org/diseases-conditions/chronic-kidney-disease/symptoms-causes/syc-20354521',
  'https://www.mayoclinic.org/diseases-conditions/color-blindness/symptoms-causes/syc-20354988',
  'https://www.mayoclinic.org/diseases-conditions/common-warts/symptoms-causes/syc-20371125',
  'https://www.mayoclinic.org/diseases-conditions/compulsive-gambling/symptoms-causes/syc-20355178',
  'https://www.mayoclinic.org/diseases-conditions/corns-and-calluses/symptoms-causes/syc-20355946',
  'https://www.mayoclinic.org/diseases-conditions/creutzfeldt-jakob-disease/symptoms-causes/syc-20371226',
  'https://www.mayoclinic.org/diseases-conditions/dandruff/symptoms-causes/syc-20353850',
  'https://www.mayoclinic.org/diseases-conditions/de-quervain-tenosynovitis/symptoms-causes/syc-20371332',
  'https://www.mayoclinic.org/diseases-conditions/deep-vein-thrombosis/symptoms-causes/syc-20352557',
  'https://www.mayoclinic.org/diseases-conditions/dehydration/symptoms-causes/syc-20354086',
  'https://www.mayoclinic.org/diseases-conditions/delayed-ejaculation/symptoms-causes/syc-20371358',
  'https://www.mayoclinic.org/diseases-conditions/delayed-sleep-phase/symptoms-causes/syc-20353340',
  'https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007',
  'https://www.mayoclinic.org/diseases-conditions/diabetic-ketoacidosis/symptoms-causes/syc-20371551',
  'https://www.mayoclinic.org/diseases-conditions/digeorge-syndrome/symptoms-causes/syc-20353543',
  'https://www.mayoclinic.org/diseases-conditions/dry-eyes/symptoms-causes/syc-20371863',
  'https://www.mayoclinic.org/diseases-conditions/dry-macular-degeneration/symptoms-causes/syc-20350375',
  'https://www.mayoclinic.org/diseases-conditions/dry-mouth/symptoms-causes/syc-20356048',
  'https://www.mayoclinic.org/diseases-conditions/dry-skin/symptoms-causes/syc-20353885',
  'https://www.mayoclinic.org/diseases-conditions/dumping-syndrome/symptoms-causes/syc-20371915',
  'https://www.mayoclinic.org/diseases-conditions/dyslexia/symptoms-causes/syc-20353552',
  'https://www.mayoclinic.org/diseases-conditions/e-coli/symptoms-causes/syc-20372058',
  'https://www.mayoclinic.org/diseases-conditions/ear-infections/symptoms-causes/syc-20351616',
  'https://www.mayoclinic.org/diseases-conditions/earwax-blockage/symptoms-causes/syc-20353004',
  'https://www.mayoclinic.org/diseases-conditions/eating-disorders/symptoms-causes/syc-20353603',
  'https://www.mayoclinic.org/diseases-conditions/ebsteins-anomaly/symptoms-causes/syc-20352127',
  'https://www.mayoclinic.org/diseases-conditions/esophageal-varices/symptoms-causes/syc-20351538',
  'https://www.mayoclinic.org/diseases-conditions/factitious-disorder/symptoms-causes/syc-20356028',
  'https://www.mayoclinic.org/diseases-conditions/factor-v-leiden/symptoms-causes/syc-20372423',
  'https://www.mayoclinic.org/diseases-conditions/familial-adenomatous-polyposis/symptoms-causes/syc-20372443',
  'https://www.mayoclinic.org/diseases-conditions/familial-hypercholesterolemia/symptoms-causes/syc-20353755',
  'https://www.mayoclinic.org/diseases-conditions/familial-mediterranean-fever/symptoms-causes/syc-20372470',
  'https://www.mayoclinic.org/diseases-conditions/farsightedness/symptoms-causes/syc-20372495',
  'https://www.mayoclinic.org/diseases-conditions/fatty-liver-disease-masld/symptoms-causes/syc-20354567',
  'https://www.mayoclinic.org/diseases-conditions/febrile-seizure/symptoms-causes/syc-20372522',
  'https://www.mayoclinic.org/diseases-conditions/flatfeet/symptoms-causes/syc-20372604',
  'https://www.mayoclinic.org/diseases-conditions/folliculitis/symptoms-causes/syc-20361634',
  'https://www.mayoclinic.org/diseases-conditions/fuchs-dystrophy/symptoms-causes/syc-20352727',
  'https://www.mayoclinic.org/diseases-conditions/galactorrhea/symptoms-causes/syc-20350431',
  'https://www.mayoclinic.org/diseases-conditions/gallbladder-cancer/symptoms-causes/syc-20353370',
  'https://www.mayoclinic.org/diseases-conditions/gallstones/symptoms-causes/syc-20354214',
  'https://www.mayoclinic.org/diseases-conditions/ganglion-cyst/symptoms-causes/syc-20351156',
  'https://www.mayoclinic.org/diseases-conditions/gangrene/symptoms-causes/syc-20352567',
  'https://www.mayoclinic.org/diseases-conditions/gas-and-gas-pains/symptoms-causes/syc-20372709',
  'https://www.mayoclinic.org/diseases-conditions/gastroparesis/symptoms-causes/syc-20355787',
  'https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803',
  'https://www.mayoclinic.org/diseases-conditions/genital-warts/symptoms-causes/syc-20355234',
  'https://www.mayoclinic.org/diseases-conditions/giant-cell-arteritis/symptoms-causes/syc-20372758',
  'https://www.mayoclinic.org/diseases-conditions/granulomatosis-with-polyangiitis/symptoms-causes/syc-20351088',
  'https://www.mayoclinic.org/diseases-conditions/h-pylori/symptoms-causes/syc-20356171',
  'https://www.mayoclinic.org/diseases-conditions/hair-loss/symptoms-causes/syc-20372926',
  'https://www.mayoclinic.org/diseases-conditions/hairy-cell-leukemia/symptoms-causes/syc-20372956',
  'https://www.mayoclinic.org/diseases-conditions/hammertoe-and-mallet-toe/symptoms-causes/syc-20350839',
  'https://www.mayoclinic.org/diseases-conditions/hamstring-injury/symptoms-causes/syc-20372985',
  'https://www.mayoclinic.org/diseases-conditions/hand-foot-and-mouth-disease/symptoms-causes/syc-20353035',
  'https://www.mayoclinic.org/diseases-conditions/hangovers/symptoms-causes/syc-20373012',
  'https://www.mayoclinic.org/diseases-conditions/hantavirus-pulmonary-syndrome/symptoms-causes/syc-20351838',
  'https://www.mayoclinic.org/diseases-conditions/heart-valve-disease/symptoms-causes/syc-20353727',
  'https://www.mayoclinic.org/diseases-conditions/henoch-schonlein-purpura/symptoms-causes/syc-20354040',
  'https://www.mayoclinic.org/diseases-conditions/hip-dysplasia/symptoms-causes/syc-20350209',
  'https://www.mayoclinic.org/diseases-conditions/hirsutism/symptoms-causes/syc-20354935',
  'https://www.mayoclinic.org/diseases-conditions/horner-syndrome/symptoms-causes/syc-20373547',
  'https://www.mayoclinic.org/diseases-conditions/hyperhidrosis/symptoms-causes/syc-20367152',
  'https://www.mayoclinic.org/diseases-conditions/hypersomnia/symptoms-causes/syc-20362332',
  'https://www.mayoclinic.org/diseases-conditions/hypothyroidism/symptoms-causes/syc-20350284',
  'https://www.mayoclinic.org/diseases-conditions/idiopathic-thrombocytopenic-purpura/symptoms-causes/syc-20352325',
  'https://www.mayoclinic.org/diseases-conditions/iga-nephropathy/symptoms-causes/syc-20352268',
  'https://www.mayoclinic.org/diseases-conditions/illness-anxiety-disorder/symptoms-causes/syc-20373782',
  'https://www.mayoclinic.org/diseases-conditions/indigestion/symptoms-causes/syc-20352211',
  'https://www.mayoclinic.org/diseases-conditions/infant-acid-reflux/symptoms-causes/syc-20351408',
  'https://www.mayoclinic.org/diseases-conditions/infant-jaundice/symptoms-causes/syc-20373865',
  'https://www.mayoclinic.org/diseases-conditions/inflammatory-bowel-disease/symptoms-causes/syc-20353315',
  'https://www.mayoclinic.org/diseases-conditions/interstitial-cystitis/symptoms-causes/syc-20354357',
  'https://www.mayoclinic.org/diseases-conditions/interstitial-lung-disease/symptoms-causes/syc-20353108',
  'https://www.mayoclinic.org/diseases-conditions/irritable-bowel-syndrome/symptoms-causes/syc-20360016',
  'https://www.mayoclinic.org/diseases-conditions/jaw-tumors-cysts/symptoms-causes/syc-20350973',
  'https://www.mayoclinic.org/diseases-conditions/jellyfish-stings/symptoms-causes/syc-20353284',
  'https://www.mayoclinic.org/diseases-conditions/jet-lag/symptoms-causes/syc-20374027',
  'https://www.mayoclinic.org/diseases-conditions/jock-itch/symptoms-causes/syc-20353807',
  'https://www.mayoclinic.org/diseases-conditions/juvenile-idiopathic-arthritis/symptoms-causes/syc-20374082',
  'https://www.mayoclinic.org/diseases-conditions/kaposis-sarcoma/symptoms-causes/syc-20577303',
  'https://www.mayoclinic.org/diseases-conditions/kawasaki-disease/symptoms-causes/syc-20354598',
  'https://www.mayoclinic.org/diseases-conditions/keloid-scar/symptoms-causes/syc-20520901',
  'https://www.mayoclinic.org/diseases-conditions/keratitis/symptoms-causes/syc-20374110',
  'https://www.mayoclinic.org/diseases-conditions/keratoconus/symptoms-causes/syc-20351352',
  'https://www.mayoclinic.org/diseases-conditions/keratosis-pilaris/symptoms-causes/syc-20351149',
  'https://www.mayoclinic.org/diseases-conditions/kidney-cancer/symptoms-causes/syc-20352664',
  'https://www.mayoclinic.org/diseases-conditions/kidney-cysts/symptoms-causes/syc-20374134',
  'https://www.mayoclinic.org/diseases-conditions/knee-pain/symptoms-causes/syc-20350849',
  'https://www.mayoclinic.org/diseases-conditions/lactose-intolerance/symptoms-causes/syc-20374232',
  'https://www.mayoclinic.org/diseases-conditions/laryngitis/symptoms-causes/syc-20374262',
  'https://www.mayoclinic.org/diseases-conditions/latex-allergy/symptoms-causes/syc-20374287',
  'https://www.mayoclinic.org/diseases-conditions/lazy-eye/symptoms-causes/syc-20352391',
  'https://www.mayoclinic.org/diseases-conditions/lead-poisoning/symptoms-causes/syc-20354717',
  'https://www.mayoclinic.org/diseases-conditions/left-ventricular-hypertrophy/symptoms-causes/syc-20374314',
  'https://www.mayoclinic.org/diseases-conditions/lichen-sclerosus/symptoms-causes/syc-20374448',
  'https://www.mayoclinic.org/diseases-conditions/lobular-carcinoma-in-situ/symptoms-causes/syc-20374529',
  'https://www.mayoclinic.org/diseases-conditions/malaria/symptoms-causes/syc-20351184',
  'https://www.mayoclinic.org/diseases-conditions/male-breast-cancer/symptoms-causes/syc-20374740',
  'https://www.mayoclinic.org/diseases-conditions/male-hypogonadism/symptoms-causes/syc-20354881',
  'https://www.mayoclinic.org/diseases-conditions/male-infertility/symptoms-causes/syc-20374773',
  'https://www.mayoclinic.org/diseases-conditions/malignant-hyperthermia/symptoms-causes/syc-20353750',
  'https://www.mayoclinic.org/diseases-conditions/malignant-peripheral-nerve-sheath-tumors/symptoms-causes/syc-20362603',
  'https://www.mayoclinic.org/diseases-conditions/mastitis/symptoms-causes/syc-20374829',
  'https://www.mayoclinic.org/diseases-conditions/medication-overuse-headache/symptoms-causes/syc-20377083',
  'https://www.mayoclinic.org/diseases-conditions/men-1/symptoms-causes/syc-20353064',
  'https://www.mayoclinic.org/diseases-conditions/menstrual-cramps/symptoms-causes/syc-20374938',
  'https://www.mayoclinic.org/diseases-conditions/mesothelioma/symptoms-causes/syc-20375022',
  'https://www.mayoclinic.org/diseases-conditions/mitral-valve-prolapse/symptoms-causes/syc-20355446',
  'https://www.mayoclinic.org/diseases-conditions/myelofibrosis/symptoms-causes/syc-20355057',
  'https://www.mayoclinic.org/diseases-conditions/nail-fungus/symptoms-causes/syc-20353294',
  'https://www.mayoclinic.org/diseases-conditions/narcissistic-personality-disorder/symptoms-causes/syc-20366662',
  'https://www.mayoclinic.org/diseases-conditions/narcolepsy/symptoms-causes/syc-20375497',
  'https://www.mayoclinic.org/diseases-conditions/nasal-paranasal-tumors/symptoms-causes/syc-20354136',
  'https://www.mayoclinic.org/diseases-conditions/nasal-polyps/symptoms-causes/syc-20351888',
  'https://www.mayoclinic.org/diseases-conditions/nasopharyngeal-carcinoma/symptoms-causes/syc-20375529',
  'https://www.mayoclinic.org/diseases-conditions/nearsightedness/symptoms-causes/syc-20375556',
  'https://www.mayoclinic.org/diseases-conditions/neck-pain/symptoms-causes/syc-20375581',
  'https://www.mayoclinic.org/diseases-conditions/nephrogenic-systemic-fibrosis/symptoms-causes/syc-20352299',
  'https://www.mayoclinic.org/diseases-conditions/neuroendocrine-tumors/symptoms-causes/syc-20354132',
  'https://www.mayoclinic.org/diseases-conditions/neurofibromatosis-type-2/symptoms-causes/syc-20594157',
  'https://www.mayoclinic.org/diseases-conditions/obesity/symptoms-causes/syc-20375742',
  'https://www.mayoclinic.org/diseases-conditions/obsessive-compulsive-disorder/symptoms-causes/syc-20354432',
  'https://www.mayoclinic.org/diseases-conditions/obstructive-sleep-apnea/symptoms-causes/syc-20352090',
  'https://www.mayoclinic.org/diseases-conditions/occupational-asthma/symptoms-causes/syc-20375772',
  'https://www.mayoclinic.org/diseases-conditions/ocular-rosacea/symptoms-causes/syc-20375798',
  'https://www.mayoclinic.org/diseases-conditions/osteoarthritis/symptoms-causes/syc-20351925',
  'https://www.mayoclinic.org/diseases-conditions/overactive-bladder/symptoms-causes/syc-20355715',
  'https://www.mayoclinic.org/diseases-conditions/pagets-disease-of-bone/symptoms-causes/syc-20350811',
  'https://www.mayoclinic.org/diseases-conditions/pagets-disease-of-the-breast/symptoms-causes/syc-20351079',
  'https://www.mayoclinic.org/diseases-conditions/painful-intercourse/symptoms-causes/syc-20375967',
  'https://www.mayoclinic.org/diseases-conditions/patellar-tendinitis/symptoms-causes/syc-20376113',
  'https://www.mayoclinic.org/diseases-conditions/pediatric-sleep-apnea/symptoms-causes/syc-20376196',
  'https://www.mayoclinic.org/diseases-conditions/pediatric-white-blood-cell-disorders/symptoms-causes/syc-20352674',
  'https://www.mayoclinic.org/diseases-conditions/peptic-ulcer/symptoms-causes/syc-20354223',
  'https://www.mayoclinic.org/diseases-conditions/peripheral-artery-disease/symptoms-causes/syc-20350557',
  'https://www.mayoclinic.org/diseases-conditions/petit-mal-seizure/symptoms-causes/syc-20359683',
  'https://www.mayoclinic.org/diseases-conditions/plague/symptoms-causes/syc-20351291',
  'https://www.mayoclinic.org/diseases-conditions/plantar-warts/symptoms-causes/syc-20352691',
  'https://www.mayoclinic.org/diseases-conditions/poison-ivy/symptoms-causes/syc-20376485',
  'https://www.mayoclinic.org/diseases-conditions/popliteal-artery-entrapment/symptoms-causes/syc-20465211',
  'https://www.mayoclinic.org/diseases-conditions/precocious-puberty/symptoms-causes/syc-20351811',
  'https://www.mayoclinic.org/diseases-conditions/premature-ventricular-contractions/symptoms-causes/syc-20376757',
  'https://www.mayoclinic.org/diseases-conditions/pseudobulbar-affect/symptoms-causes/syc-20353737',
  'https://www.mayoclinic.org/diseases-conditions/pseudomembranous-colitis/symptoms-causes/syc-20351434',
  'https://www.mayoclinic.org/diseases-conditions/pseudotumor-cerebri/symptoms-causes/syc-20354031',
  'https://www.mayoclinic.org/diseases-conditions/rabies/symptoms-causes/syc-20351821',
  'https://www.mayoclinic.org/diseases-conditions/radiation-enteritis/symptoms-causes/syc-20355409',
  'https://www.mayoclinic.org/diseases-conditions/radiation-sickness/symptoms-causes/syc-20377058',
  'https://www.mayoclinic.org/diseases-conditions/ramsay-hunt-syndrome/symptoms-causes/syc-20351783',
  'https://www.mayoclinic.org/diseases-conditions/raynauds-disease/symptoms-causes/syc-20363571',
  'https://www.mayoclinic.org/diseases-conditions/reactive-arthritis/symptoms-causes/syc-20354838',
  'https://www.mayoclinic.org/diseases-conditions/reactive-attachment-disorder/symptoms-causes/syc-20352939',
  'https://www.mayoclinic.org/diseases-conditions/rectal-ulcer/symptoms-causes/syc-20377749',
  'https://www.mayoclinic.org/diseases-conditions/rectocele/symptoms-causes/syc-20353414',
  'https://www.mayoclinic.org/diseases-conditions/rem-sleep-behavior-disorder/symptoms-causes/syc-20352920',
  'https://www.mayoclinic.org/diseases-conditions/rheumatoid-arthritis/symptoms-causes/syc-20353648',
  'https://www.mayoclinic.org/diseases-conditions/ruptured-eardrum/symptoms-causes/syc-20351879',
  'https://www.mayoclinic.org/diseases-conditions/sacral-dimple/symptoms-causes/syc-20377353',
  'https://www.mayoclinic.org/diseases-conditions/sacroiliitis/symptoms-causes/syc-20350747',
  'https://www.mayoclinic.org/diseases-conditions/salivary-gland-cancer/symptoms-causes/syc-20354151',
  'https://www.mayoclinic.org/diseases-conditions/salmonella/symptoms-causes/syc-20355329',
  'https://www.mayoclinic.org/diseases-conditions/sarcoidosis/symptoms-causes/syc-20350358',
  'https://www.mayoclinic.org/diseases-conditions/scabies/symptoms-causes/syc-20377378',
  'https://www.mayoclinic.org/diseases-conditions/seasonal-affective-disorder/symptoms-causes/syc-20364651',
  'https://www.mayoclinic.org/diseases-conditions/seborrheic-keratosis/symptoms-causes/syc-20353878',
  'https://www.mayoclinic.org/diseases-conditions/shingles/symptoms-causes/syc-20353054',
  'https://www.mayoclinic.org/diseases-conditions/small-intestinal-bacterial-overgrowth/symptoms-causes/syc-20370168',
  'https://www.mayoclinic.org/diseases-conditions/spontaneous-coronary-artery-dissection/symptoms-causes/syc-20353711',
  'https://www.mayoclinic.org/diseases-conditions/swimmers-ear/symptoms-causes/syc-20351682',
  'https://www.mayoclinic.org/diseases-conditions/swine-flu/symptoms-causes/syc-20378103',
  'https://www.mayoclinic.org/diseases-conditions/swollen-knee/symptoms-causes/syc-20378129',
  'https://www.mayoclinic.org/diseases-conditions/t-cell-lymphoma/symptoms-causes/syc-20588407',
  'https://www.mayoclinic.org/diseases-conditions/tachycardia/symptoms-causes/syc-20355127',
  'https://www.mayoclinic.org/diseases-conditions/takayasus-arteritis/symptoms-causes/syc-20351335',
  'https://www.mayoclinic.org/diseases-conditions/tapeworm/symptoms-causes/syc-20378174',
  'https://www.mayoclinic.org/diseases-conditions/tay-sachs-disease/symptoms-causes/syc-20378190',
  'https://www.mayoclinic.org/diseases-conditions/teen-depression/symptoms-causes/syc-20350985',
  'https://www.mayoclinic.org/diseases-conditions/tennis-elbow/symptoms-causes/syc-20351987',
  'https://www.mayoclinic.org/diseases-conditions/tetralogy-of-fallot/symptoms-causes/syc-20353477',
  'https://www.mayoclinic.org/diseases-conditions/toe-walking/symptoms-causes/syc-20378410',
  'https://www.mayoclinic.org/diseases-conditions/traumatic-brain-injury/symptoms-causes/syc-20378557',
  'https://www.mayoclinic.org/diseases-conditions/trichotillomania/symptoms-causes/syc-20355188',
  'https://www.mayoclinic.org/diseases-conditions/triple-x-syndrome/symptoms-causes/syc-20350977',
  'https://www.mayoclinic.org/diseases-conditions/tuberculosis/symptoms-causes/syc-20351250',
  'https://www.mayoclinic.org/diseases-conditions/ulcerative-colitis/symptoms-causes/syc-20353326',
  'https://www.mayoclinic.org/diseases-conditions/ulnar-wrist-pain/symptoms-causes/syc-20355510',
  'https://www.mayoclinic.org/diseases-conditions/umbilical-hernia/symptoms-causes/syc-20378685',
  'https://www.mayoclinic.org/diseases-conditions/undescended-testicle/symptoms-causes/syc-20351995',
  'https://www.mayoclinic.org/diseases-conditions/ureteral-cancer/symptoms-causes/syc-20360721',
  'https://www.mayoclinic.org/diseases-conditions/ureteral-obstruction/symptoms-causes/syc-20354676',
  'https://www.mayoclinic.org/diseases-conditions/vaginal-agenesis/symptoms-causes/syc-20355737',
  'https://www.mayoclinic.org/diseases-conditions/vaginal-atrophy/symptoms-causes/syc-20352288',
  'https://www.mayoclinic.org/diseases-conditions/vaginal-cancer/symptoms-causes/syc-20352447',
  'https://www.mayoclinic.org/diseases-conditions/vaginal-fistulas/symptoms-causes/syc-20355762',
  'https://www.mayoclinic.org/diseases-conditions/vaginitis/symptoms-causes/syc-20354707',
  'https://www.mayoclinic.org/diseases-conditions/valley-fever/symptoms-causes/syc-20378761',
  'https://www.mayoclinic.org/diseases-conditions/varicocele/symptoms-causes/syc-20378771',
  'https://www.mayoclinic.org/diseases-conditions/varicose-veins/symptoms-causes/syc-20350643',
  'https://www.mayoclinic.org/diseases-conditions/viral-hemorrhagic-fevers/symptoms-causes/syc-20351260',
  'https://www.mayoclinic.org/diseases-conditions/wet-macular-degeneration/symptoms-causes/syc-20351107',
  'https://www.mayoclinic.org/diseases-conditions/wheat-allergy/symptoms-causes/syc-20378897',
  'https://www.mayoclinic.org/diseases-conditions/whiplash/symptoms-causes/syc-20378921',
  'https://www.mayoclinic.org/diseases-conditions/whipples-disease/symptoms-causes/syc-20378946',
  'https://www.mayoclinic.org/diseases-conditions/wilms-tumor/symptoms-causes/syc-20352655',
  'https://www.mayoclinic.org/diseases-conditions/wrist-pain/symptoms-causes/syc-20366213',
  'https://www.mayoclinic.org/diseases-conditions/x-linked-agammaglobulinemia/symptoms-causes/syc-20361635',
  'https://www.mayoclinic.org/diseases-conditions/yeast-infection/symptoms-causes/syc-20378999',
  'https://www.mayoclinic.org/diseases-conditions/yips/symptoms-causes/syc-20379021',
  'https://www.mayoclinic.org/diseases-conditions/zenkers-diverticulum/symptoms-causes/syc-20568839',
  'https://www.mayoclinic.org/diseases-conditions/zollinger-ellison-syndrome/symptoms-causes/syc-20379042',
]);
// </migrated-conditions>

/**
 * Local path for a condition page already migrated to this site, or null.
 * /diseases-conditions/<slug>/symptoms-causes/syc-... -> /health-library/diseases-conditions/<slug>/symptoms-causes
 * @param {string} href absolute www.mayoclinic.org URL
 */
function migratedConditionPath(href) {
  let url;
  try { url = new URL(href, 'https://www.mayoclinic.org'); } catch (e) { return null; }
  if (!MIGRATED_CONDITION_URLS.has(`https://www.mayoclinic.org${url.pathname.replace(/\/$/, '')}`)) return null;
  const parts = url.pathname.split('/').filter(Boolean);
  return `/health-library/diseases-conditions/${parts[1]}/${parts[2]}`;
}

/**
 * Mayo Clinic cleanup transformer.
 * Removes non-authorable chrome: global header, footer, alerts, skip links,
 * feedback/tracking widgets, iframes and framework artifacts.
 * Selectors are taken from migration-work/cleaned.html.
 */
// Condition ("Symptoms & causes") pages: everything condition-specific below is
// scoped to this layout element, which no home / diseases-conditions / A-Z page has.
const CONDITION_ROOT = '.cmp-column-control__layoutType--ThreeColumnWithL2AndAd';
const MAYO_ORIGIN = 'https://www.mayoclinic.org';

// True when nothing authorable is left inside el (no text, no media, no block table)
function isEmpty(el) {
  return !el.textContent.trim() && !el.querySelector('img, picture, video, iframe, table, hr');
}

// Remove el, then every ancestor it leaves empty, stopping at (and keeping) stopAt
function removeWithEmptyWrappers(el, stopAt) {
  let parent = el.parentElement;
  el.remove();
  while (parent && parent !== stopAt && stopAt.contains(parent) && isEmpty(parent)) {
    const next = parent.parentElement;
    parent.remove();
    parent = next;
  }
}

// Same slug as the Edge Delivery html pipeline gives headings (github-slugger),
// e.g. "When to see a doctor" -> "when-to-see-a-doctor", "Diseases & Conditions" -> "diseases--conditions"
function slugify(text) {
  return text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
}

// Condition page YouTube video: the source renders it as an iframe inside .cmp-video-from-model.
// All iframes are removed in beforeTransform (before parsers run), so the embed URL is first
// recorded on the video container as data-youtube-src (canonical https://www.youtube.com/watch?v=ID)
// for the video-inline parser to read.
function recordYoutubeVideos(element) {
  element.querySelectorAll('.cmp-video-from-model').forEach((video) => {
    if (video.hasAttribute('data-youtube-src')) return;
    const iframe = video.querySelector('iframe[src*="youtube"], iframe[id^="youtube-"]');
    if (!iframe) return;
    const src = iframe.getAttribute('src') || '';
    const fromSrc = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/);
    const fromId = (iframe.id || '').match(/^youtube-([\w-]{6,}?)(?:-r\d+)?$/);
    const id = (fromSrc && fromSrc[1]) || (fromId && fromId[1]);
    if (id) video.setAttribute('data-youtube-src', `https://www.youtube.com/watch?v=${id}`);
  });
}

function cleanConditionBefore(root) {
  const doc = root.ownerDocument;

  // Right ad rail: ad slots, advertising disclaimer, "Mayo Clinic Press" promo links
  root.querySelectorAll('.cmp-column-control__ad-column').forEach((el) => el.remove());

  const column = root.querySelector('.cmp-column-control__content-column');
  if (column) {
    [
      // Duplicate section nav at the end of the article (mobile pattern; the left nav is the block)
      '.cmp-level-two-navigation',
      // Newsletter sign-up card (e-mail form)
      '.cmp-news-letter-signup-from-model',
      // Print button (links to the ?p=1 print rendition)
      '.cmp-print-button',
      // Internal content ID (CON-...)
      '.cmp-poc-id',
      // Empty placeholders
      '#empty-dynamic-related-content',
      // In-article mobile ad slot and its separators
      '#cmp-mobile-advertisement__wrapped-content-container',
      '.cmp-mobile-advertisement',
      // Decorative separators inside the related-content and news lists
      '.cmp-dynamic-related-content .cmp-separator',
      '.cmp-dynamic-related-content hr',
      '.cmp-news-and-patient-stories .cmp-separator',
      '.cmp-news-and-patient-stories hr',
    ].forEach((sel) => {
      column.querySelectorAll(sel).forEach((el) => {
        if (!el.isConnected) return;
        const target = el.closest('.cmp-link') && sel === '.cmp-print-button' ? el.closest('.cmp-link') : el;
        removeWithEmptyWrappers(target, column);
      });
    });
  }

  // Decorative icons (inline SVG and data-URI chevrons/arrows/play icons) in the article and
  // blocks: removed before parsers run so they never read an icon as a thumbnail or image
  root.querySelectorAll('.cmp-icon, svg').forEach((el) => el.remove());

  // Lazy images: make sure src is the real image URL (data-src / srcset)
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    const placeholder = !src || src.startsWith('data:') || /blank|placeholder|spacer/i.test(src);
    const lazy = img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('data-original');
    const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
    if (lazy && placeholder) {
      img.setAttribute('src', lazy);
    } else if (placeholder && srcset) {
      const first = srcset.split(',')[0].trim().split(/\s+/)[0];
      if (first) img.setAttribute('src', first);
    }
    ['data-src', 'data-lazy-src', 'data-original', 'data-srcset', 'srcset', 'sizes'].forEach((a) => img.removeAttribute(a));
  });

  // H1: "Atrial fibrillation<div class=second-title>Symptoms and causes</div>" -> "Atrial fibrillation<br>Symptoms and causes"
  root.querySelectorAll('.cmp-titlewithparent h1').forEach((h1) => {
    const second = h1.querySelector('.second-title');
    const secondText = second ? second.textContent.trim() : '';
    if (second) second.remove();
    const firstText = h1.textContent.replace(/\s+/g, ' ').trim();
    const heading = doc.createElement('h1');
    heading.append(doc.createTextNode(firstText));
    if (secondText) heading.append(doc.createElement('br'), doc.createTextNode(secondText));
    h1.replaceWith(heading);
  });
}

// Plain-text label of a Mayo button/link component (drops icon spans)
function linkText(a) {
  const label = a.querySelector('.cmp-button__text') || a;
  return label.textContent.replace(/\s+/g, ' ').trim();
}

function cleanLink(doc, a) {
  const link = doc.createElement('a');
  link.setAttribute('href', a.getAttribute('href'));
  link.textContent = linkText(a);
  return link;
}

function paragraph(doc, ...children) {
  const p = doc.createElement('p');
  p.append(...children);
  return p;
}

// Default content (not inside a block table) of the condition article
function isDefaultContent(el) {
  return !el.closest('table');
}

function cleanConditionAfter(root) {
  const doc = root.ownerDocument;
  const each = (sel, fn) => [...root.querySelectorAll(sel)].filter(isDefaultContent).forEach(fn);

  // Unwrap article markup wrappers (DITA-style conbodydiv / section)
  each('conbodydiv, section', (el) => el.replaceWith(...el.childNodes));

  // "On this page": label paragraph + list of anchor links. Anchors point at the heading slug
  // Edge Delivery generates (source ids like #when-to-seek-care differ from the heading text).
  each('.cmp-anchor-nav', (nav) => {
    const frag = doc.createDocumentFragment();
    const label = nav.querySelector('.cmp-title, h2');
    if (label && label.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(label.textContent.trim())));
    const ul = doc.createElement('ul');
    nav.querySelectorAll('a[href]').forEach((a) => {
      const link = cleanLink(doc, a);
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        let target = null;
        try { target = root.querySelector(`[id="${href.slice(1).replace(/"/g, '\\"')}"]`); } catch (e) { /* keep href */ }
        if (target && target.textContent.trim()) link.setAttribute('href', `#${slugify(target.textContent)}`);
      }
      const li = doc.createElement('li');
      li.append(link);
      ul.append(li);
    });
    if (ul.children.length) frag.append(ul);
    nav.replaceWith(frag);
  });

  // "Top ranked" text card: heading, description, link
  each('.cmp-text-card', (card) => {
    const frag = doc.createDocumentFragment();
    const title = card.querySelector('.cmp-text-card__title, h2, h3');
    if (title && title.textContent.trim()) {
      const h = doc.createElement(title.tagName.toLowerCase().match(/^h[1-6]$/) ? title.tagName.toLowerCase() : 'h2');
      h.textContent = title.textContent.trim();
      frag.append(h);
    }
    const desc = card.querySelector('.cmp-text-card__description');
    if (desc) frag.append(...desc.childNodes);
    card.querySelectorAll('.cmp-text-card__buttons a[href]').forEach((a) => frag.append(paragraph(doc, cleanLink(doc, a))));
    card.replaceWith(frag);
  });

  // Illustrations: image, bold title paragraph, caption paragraph(s)
  each('.cmp-image-with-title', (fig) => {
    const frag = doc.createDocumentFragment();
    const img = fig.querySelector('picture') || fig.querySelector('img');
    if (img) frag.append(paragraph(doc, img));
    const title = fig.querySelector('.cmp-image-with-title__title-wrapper .cmp-title');
    if (title && title.textContent.trim()) {
      const strong = doc.createElement('strong');
      strong.textContent = title.textContent.trim();
      frag.append(paragraph(doc, strong));
    }
    const caption = fig.querySelector('.cmp-text__rich-content');
    if (caption) {
      const blocks = caption.querySelectorAll(':scope > p, :scope > ul, :scope > ol');
      if (blocks.length) frag.append(...blocks);
      else if (caption.textContent.trim()) frag.append(paragraph(doc, doc.createTextNode(caption.textContent.trim())));
    }
    fig.replaceWith(frag);
  });

  // Definition lists (e.g. "Symptoms in children and teenagers"): dt -> h3, dd -> its content
  each('dl', (dl) => {
    const frag = doc.createDocumentFragment();
    [...dl.children].forEach((child) => {
      if (child.tagName === 'DT') {
        const h3 = doc.createElement('h3');
        h3.textContent = child.textContent.trim();
        frag.append(h3);
      } else if (child.tagName === 'DD') {
        frag.append(...child.childNodes);
      }
    });
    dl.replaceWith(frag);
  });

  // Byline ("By Mayo Clinic Staff") and date
  each('a.cmp-health-information-topic__byline', (a) => (a.closest('.cmp-link') || a).replaceWith(paragraph(doc, cleanLink(doc, a))));
  each('.cmp-health-information-topic__date', (el) => el.replaceWith(paragraph(doc, doc.createTextNode(el.textContent.trim()))));

  // Button links ("Request an appointment" pills are primary buttons: <strong><a>)
  each('a.cmp-button', (a) => {
    if (!a.isConnected || !a.getAttribute('href')) return;
    const link = cleanLink(doc, a);
    const primary = a.matches('.cmp-request-appointment-button') || !!a.querySelector('.cmp-button__inner--type-pill');
    let content = link;
    if (primary) {
      content = doc.createElement('strong');
      content.append(link);
    }
    const wrapper = a.closest('.cmp-link') || a;
    if (wrapper.closest('li, p')) wrapper.replaceWith(content);
    else wrapper.replaceWith(paragraph(doc, content));
  });

  // Headings: plain text, no component classes or source ids
  each('h1, h2, h3, h4, h5, h6', (h) => {
    [...h.attributes].forEach((attr) => h.removeAttribute(attr.name));
  });

  // Links to pages that are not on this site point back to mayoclinic.org
  // (links already rewritten to /health-library/... stay relative)
  root.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === '/health-library' || href.startsWith('/health-library/')) return;
    const absolute = `${MAYO_ORIGIN}${href}`;
    a.setAttribute('href', absolute);
    if (a.textContent.trim() === href) a.textContent = absolute;
  });
}

// Images on www.mayoclinic.org can't be fetched by Edge Delivery (bot protection), so they are
// hosted in DA under media/mayoclinic/ (same file name, lower-cased) and referenced from there.
// New images found by an import must be downloaded and uploaded to that folder before publishing.
const DA_MEDIA = 'https://content.da.live/charronadobe/mayo-rdda/media/mayoclinic';

// Kaltura video thumbnails are hosted in DA too (media/thumbnails/kaltura-<entry id>.jpg): the
// workspace Sync can't copy images from Kaltura.
const DA_KALTURA = 'https://content.da.live/charronadobe/mayo-rdda/media/thumbnails';

function daMediaUrl(src) {
  let url;
  try { url = new URL(src, 'https://www.mayoclinic.org'); } catch (e) { return null; }
  if (/(^|\.)kaltura\.com$/.test(url.hostname)) {
    const entry = (url.pathname.match(/\/entry_id\/([^/]+)/) || [])[1];
    return entry ? `${DA_KALTURA}/kaltura-${entry.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}.jpg` : null;
  }
  if (url.hostname !== 'www.mayoclinic.org') return null;
  const name = decodeURIComponent(url.pathname.split('/').pop() || '').toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  return name ? `${DA_MEDIA}/${name}` : null;
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Share image in the page metadata (read from these tags by createMetadata)
    const head = element.ownerDocument && element.ownerDocument.head;
    if (head) {
      head.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"], meta[property="twitter:image"]').forEach((meta) => {
        const local = daMediaUrl(meta.getAttribute('content') || '');
        if (local) meta.setAttribute('content', local);
      });
    }

    // Condition pages: keep the YouTube URL before the iframe is removed below
    recordYoutubeVideos(element);

    // Elements that could interfere with block matching
    WebImporter.DOMUtils.remove(element, [
      // Global alert banners (empty ul in captured DOM)
      '.cmp-global-alerts',
      // Skip links (global and "Skip this Section" in alphabet facet)
      '.cmp-skip-to-main',
      // Feedback widget (Medallia/Kampyle)
      '#kampyleButtonContainer',
      '.kampyle_feedback-button',
      // Next.js route announcer
      'next-route-announcer',
      // Tracking / text-zoom iframes
      'iframe',
      // Decorative horizontal rule between sections (would create a stray section break)
      '.cmp-separator',
      // Decorative chevron icons (inline data-URI SVGs) inside A-Z letter links
      '.cmp-alphabet-facet .cmp-icon',
      // Breadcrumb: navigation chrome generated from the page path (diseases-conditions)
      '.cmp-breadcrumb',
      // Empty right-hand aside column (no text or media)
      '#main-content aside',
      // A-Z index pages: advertisement wrapper and the advertising disclaimer
      // ("Mayo Clinic does not endorse...", Advertising & Sponsorship links)
      // that sit next to the aside in the right-hand column
      '.cmp-advertisement__wrapper',
      '#advertising-disclaimer',
      // Some letter pages (e.g. O, S, X) render the disclaimer as a link list in its own container
      '.cmp-container--column-padding-3x:has(> .aem-GridColumn > .cmp-link-list-from-model a[href*="/about-this-site/advertising-sponsorship"])',
    ]);

    // A-Z index pages: "Back to top" links after each letter group
    element.querySelectorAll('.cmp-azresults a.cmp-back-to-top').forEach((a) => {
      const wrapper = a.closest('.cmp-link') || a;
      wrapper.remove();
    });

    // Condition pages: ad rail, duplicate nav, newsletter, print, content ID, lazy images, H1
    element.querySelectorAll(CONDITION_ROOT).forEach(cleanConditionBefore);
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      // Global header wrapper
      'div.aem-page.page > div:nth-child(1) > div:nth-child(2)',
      '#header__container',
      'header',
      // Footer
      '#cmp-footer',
      'footer',
      // Remaining nav and non-authorable elements
      'nav',
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // The A-Z index and search results pages only exist on mayoclinic.org:
    // make links to them absolute (e.g. the homepage letter list)
    element.querySelectorAll('a[href^="/diseases-conditions/index"], a[href^="/diseases-conditions/search-results"]').forEach((a) => {
      const href = a.getAttribute('href');
      const absolute = `https://www.mayoclinic.org${href}`;
      a.setAttribute('href', absolute);
      if (a.textContent.trim() === href) a.textContent = absolute;
    });

    // A-Z letter links point to the migrated letter pages on this site
    // (/diseases-conditions/index?letter=A -> /health-library/diseases-conditions/a, '#' -> other)
    element.querySelectorAll('a[href*="/diseases-conditions/index?letter="]').forEach((a) => {
      const url = new URL(a.getAttribute('href'), 'https://www.mayoclinic.org');
      if (url.hostname !== 'www.mayoclinic.org' || url.pathname !== '/diseases-conditions/index') return;
      const letter = (url.searchParams.get('letter') || '').trim().toLowerCase();
      if (!letter) return;
      a.setAttribute('href', `/health-library/diseases-conditions/${/^[a-z]$/.test(letter) ? letter : 'other'}`);
    });

    // A-Z index pages: normalize the condition list (.cmp-azresults) into
    // clean default content: bare <h2> letter headings followed by <ul> lists.
    element.querySelectorAll('.cmp-azresults').forEach((az) => {
      const doc = az.ownerDocument;

      // Condition pages only exist on mayoclinic.org: absolutize root-relative links
      az.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach((a) => {
        const href = a.getAttribute('href');
        const absolute = `https://www.mayoclinic.org${href}`;
        a.setAttribute('href', absolute);
        if (a.textContent.trim() === href) a.textContent = absolute;
      });

      // Condition pages already migrated to this site (tools/importer/migrated-pages.js)
      // link to the migrated copy; the rest stay on www.mayoclinic.org
      az.querySelectorAll('a[href^="https://www.mayoclinic.org/diseases-conditions/"]').forEach((a) => {
        const local = migratedConditionPath(a.getAttribute('href'));
        if (local) a.setAttribute('href', local);
      });

      // Letter headings: unwrap div.cmp-result-letters > h2
      az.querySelectorAll('.cmp-result-letters').forEach((wrap) => {
        const h2 = wrap.querySelector('h2');
        if (!h2) { wrap.remove(); return; }
        const heading = doc.createElement('h2');
        heading.textContent = h2.textContent.trim();
        wrap.replaceWith(heading);
      });

      az.querySelectorAll('ul > li').forEach((li) => {
        const cleanLink = (a) => {
          const link = doc.createElement('a');
          link.setAttribute('href', a.getAttribute('href'));
          link.textContent = a.textContent.trim();
          return link;
        };
        const alias = li.querySelector('.cmp-results-with-primary-name');
        if (alias) {
          // Alias item: label <br> See <a>
          const label = alias.querySelector('.cmp-results-with-primary-name__label');
          const a = alias.querySelector('a[href]');
          li.textContent = '';
          if (label) li.append(doc.createTextNode(label.textContent.trim()));
          if (a) {
            if (label) li.append(doc.createElement('br'));
            li.append(doc.createTextNode('See '), cleanLink(a));
          }
          return;
        }
        // Primary item: just the link to the condition
        const a = li.querySelector('a[href]');
        if (a) {
          li.textContent = '';
          li.append(cleanLink(a));
        }
      });

      // Strip list attributes
      az.querySelectorAll('ul, li').forEach((el) => {
        [...el.attributes].forEach((attr) => el.removeAttribute(attr.name));
      });
    });

    // Condition pages: article default content and absolute mayoclinic.org links
    element.querySelectorAll(CONDITION_ROOT).forEach(cleanConditionAfter);

    // www.mayoclinic.org images -> DA-hosted copies (see daMediaUrl)
    element.querySelectorAll('img[src]').forEach((img) => {
      const local = daMediaUrl(img.getAttribute('src'));
      if (local) img.setAttribute('src', local);
    });

    // Strip tracking / framework attributes
    element.querySelectorAll('[onclick], [data-track], [data-analytics], [data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
