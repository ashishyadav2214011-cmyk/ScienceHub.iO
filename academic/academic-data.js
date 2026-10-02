const BOARD='UP Board';
const SESSION='2026-27';
const SYLLABUS_INDEX='https://upmsp.edu.in/Board_Syllabus.aspx';
const SOURCE_VERIFICATION='official_pdf_link_and_session_verified';

const subjectDefinitions=[
 ['phy','11','PHY','Physics','भौतिक विज्ञान'],
 ['chem','11','CHEM','Chemistry','रसायन विज्ञान'],
 ['bio','11','BIO','Biology','जीव विज्ञान'],
 ['eng','11','ENG','English','अंग्रेज़ी'],
 ['hin','11','HIN','Hindi','हिन्दी'],
 ['phy12','12','PHY','Physics','भौतिक विज्ञान'],
 ['chem12','12','CHEM','Chemistry','रसायन विज्ञान'],
 ['bio12','12','BIO','Biology','जीव विज्ञान'],
 ['eng12','12','ENG','English','अंग्रेज़ी'],
 ['hin12','12','HIN','Hindi','हिन्दी']
];

const subjects=subjectDefinitions.map(([id,classId,code,name,nameHi])=>({
 id,classId,board:BOARD,code,name,nameHi,
 classes:[classId],
 description:`Class ${classId} ${name} syllabus and learning structure.`,
 descriptionHi:`कक्षा ${classId} ${nameHi} का पाठ्यक्रम और अध्ययन संरचना।`,
 alignment:'UPMSP syllabus; NCERT-aligned where applicable.',
 source:'UPMSP',
 provenance:`Official ${SESSION} syllabus PDF linked from ${SYLLABUS_INDEX}; detailed chapter, topic, and concept mapping is tracked separately in coverage.`,
 verificationStatus:SOURCE_VERIFICATION
}));

const chapters=[
 {id:'phy11-1',classId:'11',subjectId:'phy',chapterNumber:1,title:'Units and Measurements',titleHi:'मात्रक और मापन',description:'Measurement, units and dimensions.',descriptionHi:'मापन, मात्रक और विमाएँ।',verificationStatus:'requires_syllabus_mapping'},
 {id:'phy11-2',classId:'11',subjectId:'phy',chapterNumber:2,title:'Motion in a Straight Line',titleHi:'सरल रेखा में गति',description:'Position, velocity and acceleration.',descriptionHi:'स्थिति, वेग और त्वरण।',verificationStatus:'requires_syllabus_mapping'},
 {id:'chem11-1',classId:'11',subjectId:'chem',chapterNumber:1,title:'Some Basic Concepts of Chemistry',titleHi:'रसायन विज्ञान की मूल अवधारणाएँ',description:'Atoms, moles and chemical calculations.',descriptionHi:'परमाणु, मोल और रासायनिक गणनाएँ।',verificationStatus:'requires_syllabus_mapping'},
 {id:'bio11-1',classId:'11',subjectId:'bio',chapterNumber:1,title:'The Living World',titleHi:'जीव जगत',description:'Living organisms and biological organisation.',descriptionHi:'जीव और जैविक संगठन।',verificationStatus:'requires_syllabus_mapping'},
 {id:'eng11-1',classId:'11',subjectId:'eng',chapterNumber:1,title:'Reading',titleHi:'पठन',description:'Unseen-passage comprehension and vocabulary.',descriptionHi:'अपठित गद्यांश की समझ और शब्दावली।',verificationStatus:'verified_syllabus_section'},
 {id:'hin11-1',classId:'11',subjectId:'hin',chapterNumber:1,title:'Unit 1',titleHi:'इकाई 1',description:'Official syllabus unit; prescribed-text titles require transcription.',descriptionHi:'आधिकारिक पाठ्यक्रम इकाई; निर्धारित पाठों के शीर्षक का लिप्यंतरण लंबित है।',verificationStatus:'verified_unit_structure'},
 {id:'phy12-1',classId:'12',subjectId:'phy12',chapterNumber:1,title:'Electrostatics',titleHi:'स्थिर वैद्युतिकी',description:'Electric charge, field and potential.',descriptionHi:'वैद्युत आवेश, क्षेत्र और विभव।',verificationStatus:'requires_syllabus_mapping'},
 {id:'chem12-1',classId:'12',subjectId:'chem12',chapterNumber:1,title:'Solutions',titleHi:'विलयन',description:'Concentration and solution properties.',descriptionHi:'सांद्रता और विलयन के गुण।',verificationStatus:'requires_syllabus_mapping'},
 {id:'bio12-1',classId:'12',subjectId:'bio12',chapterNumber:1,title:'Reproduction',titleHi:'प्रजनन',description:'Reproductive biology.',descriptionHi:'प्रजनन जीवविज्ञान।',verificationStatus:'requires_syllabus_mapping'},
 {id:'eng12-1',classId:'12',subjectId:'eng12',chapterNumber:1,title:'Reading',titleHi:'पठन',description:'Unseen-passage comprehension and vocabulary.',descriptionHi:'अपठित गद्यांश की समझ और शब्दावली।',verificationStatus:'verified_syllabus_section'},
 {id:'hin12-1',classId:'12',subjectId:'hin12',chapterNumber:1,title:'Unit 1',titleHi:'इकाई 1',description:'Official syllabus unit; prescribed-text titles require transcription.',descriptionHi:'आधिकारिक पाठ्यक्रम इकाई; निर्धारित पाठों के शीर्षक का लिप्यंतरण लंबित है।',verificationStatus:'verified_unit_structure'}
];

const scienceUnitDefinitions=[
 ['11','phy',['Physical World and Measurement','Kinematics','Laws of Motion','Work, Energy and Power','System of Particles and Rotational Motion','Gravitation','Properties of Bulk Matter','Thermodynamics','Behaviour of an Ideal Gas and Kinetic Theory','Oscillations and Waves']],
 ['11','chem',['Some Basic Concepts of Chemistry','Structure of Atom','Classification of Elements and Periodicity','Chemical Bonding and Molecular Structure','Thermodynamics','Equilibrium','Redox Reactions','Organic Chemistry: Basic Principles and Techniques','Hydrocarbons']],
 ['11','bio',['Diversity in the Living World','Structural Organisation in Plants and Animals','Cell: Structure and Function','Plant Physiology','Human Physiology']],
 ['12','phy12',['Electrostatics','Current Electricity','Magnetic Effects of Current and Magnetism','Electromagnetic Induction and Alternating Currents','Electromagnetic Waves','Optics','Dual Nature of Matter and Radiation','Atoms and Nuclei','Electronic Devices']],
 ['12','chem12',['Solutions','Electrochemistry','Chemical Kinetics','The d- and f-Block Elements','Coordination Compounds','Haloalkanes and Haloarenes','Alcohols, Phenols and Ethers','Aldehydes, Ketones and Carboxylic Acids','Amines','Biomolecules']],
 ['12','bio12',['Reproduction','Genetics and Evolution','Biology and Human Welfare','Biotechnology','Ecology']]
];

for(const [classId,subjectId,titles] of scienceUnitDefinitions){
 const firstUnitNumber=subjectId==='bio12'?6:1;
 titles.forEach((title,index)=>{
      const chapterNumber=firstUnitNumber+index;
      const existing=chapters.find(chapter=>chapter.classId===classId&&chapter.subjectId===subjectId&&(chapter.chapterNumber===chapterNumber||(subjectId==='bio12'&&chapter.id==='bio12-1'&&chapterNumber===6)));
      const resourceId=`upmsp-${classId}-${subjectId.replace(/12$/,'')}`;
      if(existing){
         existing.chapterNumber=chapterNumber;
         existing.title=title;
         existing.structureType='upmsp_syllabus_unit';
         existing.provenance=`Canonical English rendering of UPMSP ${SESSION} syllabus unit ${chapterNumber}; source resource ${resourceId}. Detailed textbook chapter and topic mapping remains pending.`;
         existing.verificationStatus='verified_upmsp_unit_title_mapping_pending';
         return;
      }
      const prefix=subjectId.endsWith(classId)?subjectId:`${subjectId}${classId}`;
      chapters.push({
         id:`${prefix}-${chapterNumber}`,classId,subjectId,chapterNumber,title,titleHi:null,
         description:`UPMSP ${SESSION} syllabus unit ${chapterNumber}; detailed prescribed scope is recorded in the official source PDF.`,
         descriptionHi:null,structureType:'upmsp_syllabus_unit',source:'UPMSP',
         provenance:`Canonical English rendering of UPMSP ${SESSION} syllabus unit ${chapterNumber}; source resource ${resourceId}. Fine-grained textbook chapter and topic mapping remains pending.`,
         verificationStatus:'verified_upmsp_unit_title_mapping_pending'
      });
 });
}

for(const classId of ['11','12']){
 const subjectId=classId==='11'?'hin':'hin12';
 const existing=chapters.find(chapter=>chapter.classId===classId&&chapter.subjectId===subjectId);
 for(let unitNumber=2;unitNumber<=4;unitNumber++){
      const resourceId=`upmsp-${classId}-hin`;
      chapters.push({
         id:`hin${classId}-${unitNumber}`,classId,subjectId,chapterNumber:unitNumber,
         title:`Unit ${unitNumber}`,titleHi:`इकाई ${unitNumber}`,
         description:'Official syllabus unit; prescribed-text titles require transcription.',
         descriptionHi:'आधिकारिक पाठ्यक्रम इकाई; निर्धारित पाठों के शीर्षक का लिप्यंतरण लंबित है।',
         structureType:'upmsp_syllabus_unit',source:'UPMSP',
         provenance:`UPMSP ${SESSION} Hindi syllabus defines this numbered unit in source resource ${resourceId}; legacy PDF font encoding prevents reliable prescribed-title transcription.`,
         verificationStatus:'verified_unit_structure_titles_pending_transcription'
      });
 }
 existing.structureType='upmsp_syllabus_unit';
 existing.source='UPMSP';
 existing.provenance=`UPMSP ${SESSION} Hindi syllabus unit 1; prescribed-text titles require transcription from source resource upmsp-${classId}-hin.`;
}

const englishSelections={
 '11':[
    ['Hornbill prose',['The Portrait of a Lady','We’re Not Afraid to Die… If We Can All Be Together','Discovering Tut: The Saga Continues','The Ailing Planet: The Green Movement’s Role','The Adventure','Silk Road']],
    ['Hornbill poetry',['A Photograph','The Laburnum Top','The Voice of the Rain','Childhood','Father to Son']],
    ['Snapshots supplementary reader',['The Summer of the Beautiful White Horse','The Address','Mother’s Day','Birth','The Tale of Melon City']]
 ],
 '12':[
    ['Flamingo prose',['The Last Lesson','Lost Spring','Deep Water','The Rattrap','Indigo','Poets and Pancakes','The Interview, Part I and Part II','Going Places']],
    ['Flamingo poetry',['My Mother at Sixty-Six','Keeping Quiet','A Thing of Beauty','A Roadside Stand','Aunt Jennifer’s Tigers']],
    ['Vistas supplementary reader',['The Third Level','The Tiger King','Journey to the End of the Earth','The Enemy','On the Face of It','Memories of Childhood']]
 ]
};

function slug(value){return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

const englishLiteratureChapters=Object.entries(englishSelections).flatMap(([classId,groups])=>{
 let chapterNumber=3;
 const subjectId=classId==='11'?'eng':'eng12';
 return groups.flatMap(([section,titles])=>titles.map(title=>({
    id:`eng${classId}-${slug(title)}`,
    classId,subjectId,chapterNumber:++chapterNumber,title,titleHi:null,
    description:`Prescribed ${section} selection for UPMSP academic session ${SESSION}.`,
    descriptionHi:null,source:'UPMSP',
   structureType:'prescribed_text',
   provenance:`Prescribed title transcribed from the official UPMSP ${SESSION} English syllabus PDF; source resource upmsp-${classId}-eng.`,
   verificationStatus:'verified_prescribed_title'
 })));
});

const englishSkillChapters=['11','12'].flatMap(classId=>{
 const subjectId=classId==='11'?'eng':'eng12';
 const resourceId=`upmsp-${classId}-eng`;
 return [
  {id:`eng${classId}-writing`,classId,subjectId,chapterNumber:2,title:'Writing',titleHi:'लेखन',description:'Writing tasks prescribed in the UPMSP English syllabus.',descriptionHi:'UPMSP अंग्रेज़ी पाठ्यक्रम में निर्धारित लेखन कार्य।'},
  {id:`eng${classId}-grammar`,classId,subjectId,chapterNumber:3,title:'Grammar and Language Use',titleHi:'व्याकरण और भाषा-प्रयोग',description:'Grammar, vocabulary, and translation prescribed in the UPMSP English syllabus.',descriptionHi:'UPMSP अंग्रेज़ी पाठ्यक्रम में निर्धारित व्याकरण, शब्दावली और अनुवाद।'}
 ].map(chapter=>({...chapter,structureType:'syllabus_section',source:'UPMSP',provenance:`Section transcribed from the official UPMSP ${SESSION} English syllabus PDF; source resource ${resourceId}.`,verificationStatus:'verified_syllabus_section'}));
});

for(const chapter of chapters){
 chapter.source='UPMSP';
 if(!chapter.provenance){
  const resourceId=`upmsp-${chapter.classId}-${chapter.subjectId.replace(/12$/,'')}`;
  chapter.provenance=`Official UPMSP ${SESSION} syllabus structure; source resource ${resourceId}. Detailed prescribed-text mapping remains pending.`;
 }
}
chapters.push(...englishSkillChapters,...englishLiteratureChapters);

const concepts=[
 {id:'phy11c1',classId:'11',subjectId:'phy',chapterId:'phy11-1',topicId:'topic-phy11-measurement',conceptNumber:1,topic:'Measurement',topicHi:'मापन',title:'SI Units',titleHi:'SI मात्रक',summary:'Base and derived SI units.',summaryHi:'SI के मूल और व्युत्पन्न मात्रक।',difficulty:'foundation',prerequisites:[]},
 {id:'phy11c2',classId:'11',subjectId:'phy',chapterId:'phy11-2',topicId:'topic-phy11-velocity',conceptNumber:1,topic:'Velocity',topicHi:'वेग',title:'Velocity',titleHi:'वेग',summary:'Velocity as displacement per unit time.',summaryHi:'वेग, प्रति इकाई समय में विस्थापन है।',difficulty:'foundation',prerequisites:[]},
 {id:'chem11c1',classId:'11',subjectId:'chem',chapterId:'chem11-1',topicId:'topic-chem11-mole',conceptNumber:1,topic:'Mole Concept',topicHi:'मोल अवधारणा',title:'Mole',titleHi:'मोल',summary:'Amount of substance and Avogadro constant.',summaryHi:'पदार्थ की मात्रा और एवोगैड्रो नियतांक।',difficulty:'foundation',prerequisites:[]},
 {id:'bio11c1',classId:'11',subjectId:'bio',chapterId:'bio11-1',topicId:'topic-bio11-characteristics',conceptNumber:1,topic:'Characteristics',topicHi:'लक्षण',title:'Characteristics of Life',titleHi:'जीवन की विशेषताएँ',summary:'Core characteristics used to identify living systems.',summaryHi:'जीवित प्रणालियों की पहचान के प्रमुख लक्षण।',difficulty:'foundation',prerequisites:[]},
 {id:'eng11c1',classId:'11',subjectId:'eng',chapterId:'eng11-1',topicId:'topic-eng11-reading',conceptNumber:1,topic:'Reading',topicHi:'पठन',title:'Main Idea',titleHi:'मुख्य विचार',summary:'Identify the central idea of a passage.',summaryHi:'गद्यांश के केंद्रीय विचार की पहचान।',difficulty:'foundation',prerequisites:[]},
 {id:'hin11c1',classId:'11',subjectId:'hin',chapterId:'hin11-1',topicId:'topic-hin11-expression',conceptNumber:1,topic:'Expression',topicHi:'अभिव्यक्ति',title:'Effective Expression',titleHi:'प्रभावी अभिव्यक्ति',summary:'Clear and appropriate language expression.',summaryHi:'स्पष्ट और उपयुक्त भाषा में विचार व्यक्त करना।',difficulty:'foundation',prerequisites:[]},
 {id:'phy12c1',classId:'12',subjectId:'phy12',chapterId:'phy12-1',topicId:'topic-phy12-charge',conceptNumber:1,topic:'Charge',topicHi:'आवेश',title:'Electric Charge',titleHi:'वैद्युत आवेश',summary:'Basic properties of electric charge.',summaryHi:'वैद्युत आवेश के मूल गुण।',difficulty:'foundation',prerequisites:[]},
 {id:'chem12c1',classId:'12',subjectId:'chem12',chapterId:'chem12-1',topicId:'topic-chem12-concentration',conceptNumber:1,topic:'Concentration',topicHi:'सांद्रता',title:'Molarity',titleHi:'मोलरता',summary:'Molarity as amount of solute per litre of solution.',summaryHi:'एक लीटर विलयन में विलेय की मोल मात्रा।',difficulty:'foundation',prerequisites:[]},
 {id:'bio12c1',classId:'12',subjectId:'bio12',chapterId:'bio12-1',topicId:'topic-bio12-reproduction',conceptNumber:1,topic:'Reproduction',topicHi:'प्रजनन',title:'Reproductive Strategies',titleHi:'प्रजनन रणनीतियाँ',summary:'Overview of reproductive processes.',summaryHi:'प्रजनन प्रक्रियाओं का परिचय।',difficulty:'foundation',prerequisites:[]},
 {id:'eng12c1',classId:'12',subjectId:'eng12',chapterId:'eng12-1',topicId:'topic-eng12-reading',conceptNumber:1,topic:'Inference',topicHi:'अनुमान',title:'Inference',titleHi:'अनुमान',summary:'Infer meaning from textual evidence.',summaryHi:'पाठ्य प्रमाण से अर्थ का अनुमान लगाना।',difficulty:'foundation',prerequisites:[]},
 {id:'hin12c1',classId:'12',subjectId:'hin12',chapterId:'hin12-1',topicId:'topic-hin12-literature',conceptNumber:1,topic:'Literature',topicHi:'साहित्य',title:'Literary Response',titleHi:'साहित्यिक प्रतिक्रिया',summary:'Respond to literary ideas with evidence.',summaryHi:'साहित्यिक विचारों पर प्रमाण सहित प्रतिक्रिया देना।',difficulty:'foundation',prerequisites:[]}
];

for(const concept of concepts){
 concept.source='ScienceHub seed';
 concept.provenance='Retained from the committed practice-linked seed; detailed UPMSP and NCERT syllabus alignment has not been verified.';
 concept.verificationStatus='pending_syllabus_mapping';
}

const englishSkillConcepts=[
 {id:'eng11c-reading-passage',classId:'11',subjectId:'eng',chapterId:'eng11-1',conceptNumber:1,topic:'Unseen Passage',topicHi:'अपठित गद्यांश',title:'Reading Comprehension',titleHi:'पठन-बोध',summary:'Answer short-response questions and vocabulary items from a long unseen passage.',summaryHi:'लंबे अपठित गद्यांश पर लघु-उत्तरीय प्रश्नों और शब्दावली संबंधी प्रश्नों के उत्तर देना।'},
 {id:'eng11c-note-summary',classId:'11',subjectId:'eng',chapterId:'eng11-writing',conceptNumber:1,topic:'Note Making and Summary',topicHi:'टिप्पणी लेखन और सारांश',title:'Note Making and Summary',titleHi:'टिप्पणी लेखन और सारांश',summary:'Make notes from a source passage and produce a summary.',summaryHi:'स्रोत गद्यांश से टिप्पणियाँ बनाना और उसका सारांश लिखना।'},
 {id:'eng11c-article-essay',classId:'11',subjectId:'eng',chapterId:'eng11-writing',conceptNumber:2,topic:'Article and Essay',topicHi:'लेख और निबंध',title:'Article and Essay Writing',titleHi:'लेख और निबंध लेखन',summary:'Write an article or essay in response to the prescribed task.',summaryHi:'निर्धारित विषय के अनुरूप लेख या निबंध लिखना।'},
 {id:'eng11c-formal-letters',classId:'11',subjectId:'eng',chapterId:'eng11-writing',conceptNumber:3,topic:'Formal Letters',topicHi:'औपचारिक पत्र',title:'Formal and Business Letters',titleHi:'औपचारिक और व्यावसायिक पत्र',summary:'Write letters to an editor, complaint letters, and business letters such as enquiries or orders.',summaryHi:'संपादक को पत्र, शिकायत-पत्र और पूछताछ या आदेश जैसे व्यावसायिक पत्र लिखना।'},
 {id:'eng11c-language-grammar',classId:'11',subjectId:'eng',chapterId:'eng11-grammar',conceptNumber:1,topic:'Grammar and Language Use',topicHi:'व्याकरण और भाषा-प्रयोग',title:'Narration, Synthesis, Transformation and Syntax',titleHi:'कथन, संश्लेषण, रूपांतरण और वाक्य-विन्यास',summary:'Apply the listed grammar areas in multiple-choice and short-answer items.',summaryHi:'सूचीबद्ध व्याकरण क्षेत्रों का बहुविकल्पीय और लघु-उत्तरीय प्रश्नों में प्रयोग करना।'},
 {id:'eng11c-vocabulary',classId:'11',subjectId:'eng',chapterId:'eng11-grammar',conceptNumber:2,topic:'Vocabulary',topicHi:'शब्दावली',title:'Idioms, Phrasal Verbs and Word Relations',titleHi:'मुहावरे, वाक्यांशीय क्रियाएँ और शब्द-संबंध',summary:'Work with idioms, phrasal verbs, synonyms, antonyms, one-word substitutions, and homophones.',summaryHi:'मुहावरों, वाक्यांशीय क्रियाओं, समानार्थी-विलोम शब्दों, एक-शब्द प्रतिस्थापन और समध्वनि शब्दों का प्रयोग करना।'},
 {id:'eng11c-translation',classId:'11',subjectId:'eng',chapterId:'eng11-grammar',conceptNumber:3,topic:'Translation',topicHi:'अनुवाद',title:'Hindi to English Translation',titleHi:'हिंदी से अंग्रेज़ी अनुवाद',summary:'Translate a short set of Hindi sentences into English.',summaryHi:'हिंदी के वाक्यों के छोटे समूह का अंग्रेज़ी में अनुवाद करना।'},
 {id:'eng11c-poetry-appreciation',classId:'11',subjectId:'eng',chapterId:'eng11-a-photograph',conceptNumber:1,topic:'Poetry Appreciation',topicHi:'कविता का आस्वादन',title:'Theme, Form, Rhyme and Imagery',titleHi:'विषय, रूप, तुक और बिंब',summary:'Appreciate a prescribed poem through its main theme, form, word choice, rhyme scheme, and imagery.',summaryHi:'निर्धारित कविता के मुख्य विषय, रूप, शब्द-चयन, तुक-योजना और बिंबों के आधार पर उसका आस्वादन करना।'},
 {id:'eng11c-figures-of-speech',classId:'11',subjectId:'eng',chapterId:'eng11-a-photograph',conceptNumber:2,topic:'Figures of Speech',topicHi:'अलंकार',title:'Identify Prescribed Figures of Speech',titleHi:'निर्धारित अलंकारों की पहचान',summary:'Identify simile, metaphor, personification, oxymoron, apostrophe, hyperbole, and onomatopoeia.',summaryHi:'उपमा, रूपक, मानवीकरण, विरोधाभास, संबोधन, अतिशयोक्ति और ध्वनि-अनुकरण की पहचान करना।'},
 {id:'eng12c-reading-passage',classId:'12',subjectId:'eng12',chapterId:'eng12-1',conceptNumber:1,topic:'Unseen Passage',topicHi:'अपठित गद्यांश',title:'Reading Comprehension',titleHi:'पठन-बोध',summary:'Answer short-response questions and vocabulary items from a long unseen passage.',summaryHi:'लंबे अपठित गद्यांश पर लघु-उत्तरीय प्रश्नों और शब्दावली संबंधी प्रश्नों के उत्तर देना।'},
 {id:'eng12c-article-writing',classId:'12',subjectId:'eng12',chapterId:'eng12-writing',conceptNumber:1,topic:'Article Writing',topicHi:'लेख लेखन',title:'Descriptive, Argumentative and Autobiographical Articles',titleHi:'वर्णनात्मक, तर्कपूर्ण और आत्मकथात्मक लेख',summary:'Write an article in one of the prescribed descriptive, argumentative, or autobiographical forms.',summaryHi:'निर्धारित वर्णनात्मक, तर्कपूर्ण या आत्मकथात्मक रूप में लेख लिखना।'},
 {id:'eng12c-formal-letters',classId:'12',subjectId:'eng12',chapterId:'eng12-writing',conceptNumber:2,topic:'Formal Letters',topicHi:'औपचारिक पत्र',title:'Formal and Business Letters',titleHi:'औपचारिक और व्यावसायिक पत्र',summary:'Write letters to an editor, complaint letters, and business letters such as enquiries or orders.',summaryHi:'संपादक को पत्र, शिकायत-पत्र और पूछताछ या आदेश जैसे व्यावसायिक पत्र लिखना।'},
 {id:'eng12c-language-grammar',classId:'12',subjectId:'eng12',chapterId:'eng12-grammar',conceptNumber:1,topic:'Grammar and Language Use',topicHi:'व्याकरण और भाषा-प्रयोग',title:'Narration, Synthesis, Transformation and Syntax',titleHi:'कथन, संश्लेषण, रूपांतरण और वाक्य-विन्यास',summary:'Apply the listed grammar areas in multiple-choice and short-answer items.',summaryHi:'सूचीबद्ध व्याकरण क्षेत्रों का बहुविकल्पीय और लघु-उत्तरीय प्रश्नों में प्रयोग करना।'},
 {id:'eng12c-vocabulary',classId:'12',subjectId:'eng12',chapterId:'eng12-grammar',conceptNumber:2,topic:'Vocabulary',topicHi:'शब्दावली',title:'Idioms, Phrasal Verbs and Word Relations',titleHi:'मुहावरे, वाक्यांशीय क्रियाएँ और शब्द-संबंध',summary:'Work with idioms, phrasal verbs, synonyms, antonyms, one-word substitutions, and homophones.',summaryHi:'मुहावरों, वाक्यांशीय क्रियाओं, समानार्थी-विलोम शब्दों, एक-शब्द प्रतिस्थापन और समध्वनि शब्दों का प्रयोग करना।'},
 {id:'eng12c-translation',classId:'12',subjectId:'eng12',chapterId:'eng12-grammar',conceptNumber:3,topic:'Translation',topicHi:'अनुवाद',title:'Hindi to English Translation',titleHi:'हिंदी से अंग्रेज़ी अनुवाद',summary:'Translate a short set of Hindi sentences into English.',summaryHi:'हिंदी के वाक्यों के छोटे समूह का अंग्रेज़ी में अनुवाद करना।'},
 {id:'eng12c-poetry-central-idea',classId:'12',subjectId:'eng12',chapterId:'eng12-my-mother-at-sixty-six',conceptNumber:1,topic:'Poetry Response',topicHi:'कविता पर प्रतिक्रिया',title:'Central Idea of a Poem',titleHi:'कविता का केंद्रीय भाव',summary:'State the central idea of a prescribed poem and answer questions about a poetry extract.',summaryHi:'निर्धारित कविता का केंद्रीय भाव बताना और काव्यांश पर आधारित प्रश्नों के उत्तर देना।'},
 {id:'eng12c-figures-of-speech',classId:'12',subjectId:'eng12',chapterId:'eng12-my-mother-at-sixty-six',conceptNumber:2,topic:'Figures of Speech',topicHi:'अलंकार',title:'Identify Prescribed Figures of Speech',titleHi:'निर्धारित अलंकारों की पहचान',summary:'Identify simile, metaphor, personification, oxymoron, apostrophe, hyperbole, and onomatopoeia.',summaryHi:'उपमा, रूपक, मानवीकरण, विरोधाभास, संबोधन, अतिशयोक्ति और ध्वनि-अनुकरण की पहचान करना।'}
];

for(const concept of englishSkillConcepts){
 concept.topicId=`topic-${concept.id}`;
 concept.difficulty='foundation';
 concept.prerequisites=[];
 concept.source='UPMSP';
 concept.provenance=`Explicit English syllabus scope in the official UPMSP 2026-27 PDF; source resource upmsp-${concept.classId}-eng.`;
 concept.verificationStatus='verified_upmsp_syllabus_scope';
}
concepts.push(...englishSkillConcepts);

const topics=concepts.map(concept=>({
 id:concept.topicId,classId:concept.classId,subjectId:concept.subjectId,
 chapterId:concept.chapterId,topicNumber:concept.conceptNumber,
 title:concept.topic,titleHi:concept.topicHi,
 description:concept.summary,descriptionHi:concept.summaryHi,
 source:concept.source,provenance:concept.provenance,
 verificationStatus:concept.verificationStatus
}));

const questionDefinitions=[
 {id:'q-phy11-1',classId:'11',subjectId:'phy',conceptId:'phy11c1',title:'SI Unit Check',titleHi:'SI मात्रक जाँच',text:'What is the SI base unit of length?',textHi:'लंबाई का SI मूल मात्रक क्या है?',type:'mcq',answer:'metre',answerHi:'मीटर',explanation:'The SI base unit of length is metre.',explanationHi:'लंबाई का SI मूल मात्रक मीटर है.'},
 {id:'q-phy11-2',classId:'11',subjectId:'phy',conceptId:'phy11c2',title:'Velocity Check',titleHi:'वेग जाँच',text:'Velocity is displacement divided by what quantity?',textHi:'वेग, विस्थापन को किस राशि से भाग देने पर प्राप्त होता है?',type:'short',answer:'time',answerHi:'समय',explanation:'Velocity is displacement per unit time.',explanationHi:'वेग प्रति इकाई समय में विस्थापन है.'},
 {id:'q-chem11-1',classId:'11',subjectId:'chem',conceptId:'chem11c1',title:'Mole Check',titleHi:'मोल जाँच',text:'Approximately how many particles are in one mole?',textHi:'एक मोल में लगभग कितने कण होते हैं?',type:'short',answer:'6.022e23',answerHi:'6.022e23',explanation:'One mole contains approximately 6.022 × 10^23 entities.',explanationHi:'एक मोल में लगभग 6.022 × 10^23 कण होते हैं.'},
 {id:'q-bio11-1',classId:'11',subjectId:'bio',conceptId:'bio11c1',title:'Life Check',titleHi:'जीवन जाँच',text:'Name one characteristic commonly used to describe living organisms.',textHi:'जीवों का वर्णन करने के लिए सामान्यतः उपयोग किया जाने वाला एक लक्षण लिखिए।',type:'short',answer:'growth',answerHi:'वृद्धि',explanation:'Growth is one commonly discussed characteristic of living organisms.',explanationHi:'वृद्धि, जीवों का सामान्यतः वर्णित एक लक्षण है.'},
 {id:'q-eng11-1',classId:'11',subjectId:'eng',conceptId:'eng11c1',title:'Reading Check',titleHi:'पठन जाँच',text:'What do we call the central message of a passage?',textHi:'किसी गद्यांश के केंद्रीय संदेश को क्या कहते हैं?',type:'short',answer:'main idea',answerHi:'मुख्य विचार',explanation:'The central message is the main idea.',explanationHi:'केंद्रीय संदेश को मुख्य विचार कहते हैं.'},
 {id:'q-hin11-1',classId:'11',subjectId:'hin',conceptId:'hin11c1',title:'Expression Check',titleHi:'अभिव्यक्ति जाँच',text:'Name one feature of expressing ideas clearly.',textHi:'स्पष्ट भाषा में विचार रखने की एक विशेषता लिखिए।',type:'short',answer:'clarity',answerHi:'स्पष्टता',explanation:'Clarity is an important feature of effective expression.',explanationHi:'स्पष्टता प्रभावी अभिव्यक्ति की महत्वपूर्ण विशेषता है.'},
 {id:'q-phy12-1',classId:'12',subjectId:'phy12',conceptId:'phy12c1',title:'Charge Check',titleHi:'आवेश जाँच',text:'What is the SI unit of electric charge?',textHi:'वैद्युत आवेश का SI मात्रक क्या है?',type:'short',answer:'coulomb',answerHi:'कूलॉम',explanation:'The SI unit of electric charge is coulomb.',explanationHi:'वैद्युत आवेश का SI मात्रक कूलॉम है.'},
 {id:'q-chem12-1',classId:'12',subjectId:'chem12',conceptId:'chem12c1',title:'Molarity Check',titleHi:'मोलरता जाँच',text:'Molarity is expressed as moles of solute per what volume?',textHi:'मोलरता में विलेय के मोल किस आयतन के प्रति व्यक्त किए जाते हैं?',type:'short',answer:'litre',answerHi:'लीटर',explanation:'Molarity is moles of solute per litre of solution.',explanationHi:'मोलरता, प्रति लीटर विलयन में विलेय के मोलों की संख्या है.'},
 {id:'q-bio12-1',classId:'12',subjectId:'bio12',conceptId:'bio12c1',title:'Reproduction Check',titleHi:'प्रजनन जाँच',text:'What is one broad purpose of reproduction?',textHi:'प्रजनन का एक व्यापक उद्देश्य क्या है?',type:'short',answer:'continuity',answerHi:'निरंतरता',explanation:'Reproduction supports continuity of a species.',explanationHi:'प्रजनन से जाति की निरंतरता बनी रहती है.'},
 {id:'q-eng12-1',classId:'12',subjectId:'eng12',conceptId:'eng12c1',title:'Inference Check',titleHi:'अनुमान जाँच',text:'What is an inference?',textHi:'अनुमान क्या है?',type:'short',answer:'conclusion',answerHi:'निष्कर्ष',explanation:'An inference is a conclusion drawn from evidence.',explanationHi:'अनुमान, प्रमाण के आधार पर निकाला गया निष्कर्ष है.'},
 {id:'q-hin12-1',classId:'12',subjectId:'hin12',conceptId:'hin12c1',title:'Literary Response Check',titleHi:'साहित्यिक प्रतिक्रिया जाँच',text:'What is useful to support a literary response?',textHi:'साहित्यिक प्रतिक्रिया के समर्थन में किसका उपयोग करना चाहिए?',type:'short',answer:'evidence',answerHi:'प्रमाण',explanation:'Evidence from the text helps support a literary response.',explanationHi:'पाठ से लिया गया प्रमाण साहित्यिक प्रतिक्रिया को पुष्ट करता है.'}
];

questionDefinitions.push(
 {id:'q-phy11-3',conceptId:'phy11c1',title:'Mass Unit Check',titleHi:'द्रव्यमान मात्रक जाँच',text:'What is the SI base unit of mass?',textHi:'द्रव्यमान का SI मूल मात्रक क्या है?',type:'short',answer:'kilogram',answerHi:'किलोग्राम',explanation:'The SI base unit of mass is kilogram.',explanationHi:'द्रव्यमान का SI मूल मात्रक किलोग्राम है.'},
 {id:'q-phy11-4',conceptId:'phy11c2',title:'Velocity Unit Check',titleHi:'वेग मात्रक जाँच',text:'What is the SI unit of velocity?',textHi:'वेग का SI मात्रक क्या है?',type:'short',answer:'m/s',answerHi:'मीटर प्रति सेकंड',explanation:'Velocity is measured in metres per second.',explanationHi:'वेग मीटर प्रति सेकंड में मापा जाता है.'},
 {id:'q-chem11-2',conceptId:'chem11c1',title:'Avogadro Constant Check',titleHi:'एवोगैड्रो नियतांक जाँच',text:'Approximately what is the value of the Avogadro constant?',textHi:'एवोगैड्रो नियतांक का लगभग मान क्या है?',type:'short',answer:'6.022e23',answerHi:'6.022e23',explanation:'The Avogadro constant is approximately 6.022 × 10^23 per mole.',explanationHi:'एवोगैड्रो नियतांक लगभग 6.022 × 10^23 प्रति मोल है.'},
 {id:'q-bio11-2',conceptId:'bio11c1',title:'Living Organism Check',titleHi:'जीव जाँच',text:'Are bacteria living organisms?',textHi:'क्या जीवाणु सजीव जीव हैं?',type:'short',answer:'yes',answerHi:'हाँ',explanation:'Bacteria are living organisms.',explanationHi:'जीवाणु सजीव जीव हैं.'},
 {id:'q-eng11-2',conceptId:'eng11c1',title:'Supporting Detail Check',titleHi:'सहायक विवरण जाँच',text:'What kind of details help support a passage’s main idea?',textHi:'गद्यांश के मुख्य विचार को पुष्ट करने में किस प्रकार के विवरण सहायक होते हैं?',type:'short',answer:'supporting details',answerHi:'सहायक विवरण',explanation:'Supporting details provide evidence for a passage’s main idea.',explanationHi:'सहायक विवरण गद्यांश के मुख्य विचार के प्रमाण देते हैं.'},
 {id:'q-hin11-2',conceptId:'hin11c1',title:'Clear Expression Check',titleHi:'स्पष्ट अभिव्यक्ति जाँच',text:'Name one quality that makes an explanation easy to understand.',textHi:'किसी व्याख्या को समझने योग्य बनाने वाला एक गुण बताइए।',type:'short',answer:'clarity',answerHi:'स्पष्टता',explanation:'Clarity helps readers understand an explanation.',explanationHi:'स्पष्टता पाठकों को व्याख्या समझने में सहायता करती है.'},
 {id:'q-phy12-2',conceptId:'phy12c1',title:'Electron Charge Check',titleHi:'इलेक्ट्रॉन आवेश जाँच',text:'What is the sign of an electron’s electric charge?',textHi:'इलेक्ट्रॉन के वैद्युत आवेश का चिह्न क्या होता है?',type:'short',answer:'negative',answerHi:'ऋणात्मक',explanation:'An electron carries a negative electric charge.',explanationHi:'इलेक्ट्रॉन पर ऋणात्मक वैद्युत आवेश होता है.'},
 {id:'q-chem12-2',conceptId:'chem12c1',title:'Molarity Volume Check',titleHi:'मोलरता आयतन जाँच',text:'Molarity is measured per litre of what?',textHi:'मोलरता में प्रति लीटर किसकी मात्रा ली जाती है?',type:'short',answer:'solution',answerHi:'विलयन',explanation:'Molarity is amount of solute per litre of solution.',explanationHi:'मोलरता प्रति लीटर विलयन में विलेय की मात्रा है.'},
 {id:'q-bio12-2',conceptId:'bio12c1',title:'Reproduction Mode Check',titleHi:'प्रजनन विधि जाँच',text:'Name the two broad modes of reproduction.',textHi:'प्रजनन की दो व्यापक विधियों के नाम बताइए।',type:'short',answer:'sexual and asexual',answerHi:'लैंगिक और अलैंगिक',explanation:'The two broad modes are sexual and asexual reproduction.',explanationHi:'दो व्यापक विधियाँ लैंगिक और अलैंगिक प्रजनन हैं.'},
 {id:'q-eng12-2',conceptId:'eng12c1',title:'Inference Evidence Check',titleHi:'अनुमान प्रमाण जाँच',text:'What should an inference be based on?',textHi:'अनुमान किस पर आधारित होना चाहिए?',type:'short',answer:'textual evidence',answerHi:'पाठ्य प्रमाण',explanation:'An inference should be grounded in evidence from the text.',explanationHi:'अनुमान पाठ से मिले प्रमाण पर आधारित होना चाहिए.'},
 {id:'q-hin12-2',conceptId:'hin12c1',title:'Literary Evidence Check',titleHi:'साहित्यिक प्रमाण जाँच',text:'What can support an interpretation of a literary text?',textHi:'साहित्यिक पाठ की व्याख्या को किससे समर्थन मिल सकता है?',type:'short',answer:'textual evidence',answerHi:'पाठ्य प्रमाण',explanation:'Textual evidence supports an interpretation.',explanationHi:'पाठ्य प्रमाण व्याख्या का समर्थन करता है.'}
);

const questions=questionDefinitions.map(question=>{
 const concept=concepts.find(item=>item.id===question.conceptId);
 return {
   ...question,classId:concept.classId,subjectId:concept.subjectId,chapterId:concept.chapterId,
    topicId:concept.topicId,difficulty:'foundation',source:'ScienceHub original practice seed',
   provenance:'Original ScienceHub practice; not copied from a textbook or represented as official.',
   verificationStatus:'original_practice_not_official',year:null,board:BOARD,aiGenerated:false
 };
});

const curriculumMappings=chapters.map(chapter=>{
 const linkedTopics=topics.filter(topic=>topic.classId===chapter.classId&&topic.subjectId===chapter.subjectId&&topic.chapterId===chapter.id);
 const linkedConcepts=concepts.filter(concept=>concept.classId===chapter.classId&&concept.subjectId===chapter.subjectId&&concept.chapterId===chapter.id);
 const resourceId=`upmsp-${chapter.classId}-${chapter.subjectId.replace(/12$/,'')}`;
 return {
    id:`mapping-${chapter.id}`,classId:chapter.classId,subjectId:chapter.subjectId,
   board:BOARD,academicSession:SESSION,chapterId:chapter.id,
   upmspUnitId:chapter.structureType==='upmsp_syllabus_unit'?chapter.id:null,
   upmspUnitTitle:chapter.structureType==='upmsp_syllabus_unit'?chapter.title:null,
    ncertChapterId:null,ncertChapterTitle:null,
    topicIds:linkedTopics.map(topic=>topic.id),conceptIds:linkedConcepts.map(concept=>concept.id),
   source:'UPMSP',sourceResourceId:resourceId,
   provenance:`Source resource ${resourceId} records the syllabus structure; exact NCERT chapter and detailed topic/concept correspondence have not been verified from extractable source text.`,
    verificationStatus:'pending_ncert_topic_concept_mapping'
 };
});

const syllabusResources=[

 ['11','phy','Physics','hi','151-Physics-Class-11.pdf'],
 ['11','chem','Chemistry','hi','152-Chemistry-Class-11.pdf'],
 ['11','bio','Biology','hi','153-Biology-Class-11.pdf'],
 ['11','eng','English','en','117-English-Class-11.pdf'],
 ['11','hin','Hindi','hi','101-Hindi-Class-11.pdf'],
 ['12','phy12','Physics','hi','151-Physics-Class-12.pdf'],
 ['12','chem12','Chemistry','hi','152-Chemistry-Class-12.pdf'],
 ['12','bio12','Biology','hi','153-Biology-Class-12.pdf'],
 ['12','eng12','English','en','117-English-Class-12.pdf'],
 ['12','hin12','Hindi','hi','101-Hindi-Class-12.pdf']
].map(([classId,subjectId,name,language,file])=>({
 id:`upmsp-${classId}-${subjectId.replace(/12$/,'')}`,
 classId,subjectId,chapterId:null,
 title:`Class ${classId} ${name} syllabus ${SESSION}`,
 titleHi:null,type:'syllabus',source:'UPMSP',
 provenance:`Official UPMSP ${SESSION} syllabus PDF linked from ${SYLLABUS_INDEX}; PDF content and session marker verified.`,
 language,official:true,
 url:`https://upmsp.edu.in/Downloads/Syllabus/Class${classId}/${file}`,
 version:SESSION,verificationStatus:SOURCE_VERIFICATION
}));

const coverage=subjects.map(subject=>({
 classId:subject.classId,subjectId:subject.id,board:BOARD,academicSession:SESSION,
 sourceResourceId:`upmsp-${subject.classId}-${subject.code.toLowerCase()}`,
 sourceVerificationStatus:SOURCE_VERIFICATION,
 chapterCount:chapters.filter(chapter=>chapter.classId===subject.classId&&chapter.subjectId===subject.id).length,
 topicCount:topics.filter(topic=>topic.classId===subject.classId&&topic.subjectId===subject.id).length,
 conceptCount:concepts.filter(concept=>concept.classId===subject.classId&&concept.subjectId===subject.id).length,
 practiceCount:questions.filter(question=>question.classId===subject.classId&&question.subjectId===subject.id).length,
 pyqCount:0,
 chapterStatus:subject.code==='ENG'
      ?'UPMSP reading_writing_grammar_and_prescribed_titles_verified'
      :subject.code==='HIN'
         ?'UPMSP_four_unit_structure_verified; prescribed_text_titles_pending_transcription'
         :'UPMSP_2026_27_syllabus_units_verified; detailed_NCERT_chapter_mapping_pending',
 topicStatus:subject.code==='ENG'
    ?'UPMSP reading_writing_grammar_and_literature_scope_mapped; individual_text_mapping_pending'
    :'partial_seed_topics_only; full syllabus mapping pending',
 conceptStatus:subject.code==='ENG'
    ?'UPMSP English skill concepts mapped; individual_text_and_NCERT_alignment_pending'
    :'partial_seed_concepts_only; full syllabus mapping pending',
 practiceStatus:'original ScienceHub practice items; not syllabus-complete or official',
 pyqStatus:'no verified PYQ records loaded',coverageStatus:'unit_level_coverage; topic_concept_and_PYQ_mapping_incomplete'
}));

export const DATA={
 schemaVersion:2,datasetStatus:'verified_2026_27_syllabus_units; detailed_topic_concept_mapping_pending',
 board:BOARD,academicSession:SESSION,subjects,chapters,curriculumMappings,
 topics,concepts,questions,pyqs:[],resources:syllabusResources,coverage
};
