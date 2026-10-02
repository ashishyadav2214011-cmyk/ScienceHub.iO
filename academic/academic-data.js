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

const topics=concepts.map(concept=>({
 id:concept.topicId,classId:concept.classId,subjectId:concept.subjectId,
 chapterId:concept.chapterId,topicNumber:concept.conceptNumber,
 title:concept.topic,titleHi:concept.topicHi,
 description:concept.summary,descriptionHi:concept.summaryHi,
 source:'ScienceHub seed',provenance:'Retained from the existing practice-linked concept; official syllabus mapping is pending.'
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

const questions=questionDefinitions.map(question=>{
 const concept=concepts.find(item=>item.id===question.conceptId);
 return {
    ...question,classId:concept.classId,chapterId:concept.chapterId,
    topicId:concept.topicId,difficulty:'foundation',source:'ScienceHub original practice seed',
    year:null,board:BOARD,aiGenerated:false
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
 topicStatus:'partial_seed_topics_only; full syllabus mapping pending',
 conceptStatus:'partial_seed_concepts_only; full syllabus mapping pending',
 practiceStatus:'original seed questions only; not syllabus-complete',
 pyqStatus:'no verified PYQ records loaded',coverageStatus:'unit_level_coverage; topic_concept_and_PYQ_mapping_incomplete'
}));

export const DATA={
 schemaVersion:2,datasetStatus:'verified_2026_27_syllabus_units; detailed_topic_concept_mapping_incomplete',
 board:BOARD,academicSession:SESSION,subjects,chapters,
 topics,concepts,questions,pyqs:[],resources:syllabusResources,coverage
};
