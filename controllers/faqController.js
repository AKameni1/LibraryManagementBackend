import FAQ from './faq.model.js'; 


export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

   
    const newFAQ = new FAQ({ question, answer });

   
    await newFAQ.save();

    
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la FAQ' });
  }
};


export const getAllFAQs = async (req, res) => {
  try {
    
    const faqs = await FAQ.find();

    
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des FAQs' });
  }
};


export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;

    
    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ introuvable' });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la FAQ' });
  }
};


export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const faq = await FAQ.findByIdAndUpdate(
      id, 
      { question, answer }, 
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ error: 'FAQ introuvable' });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la FAQ' });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ introuvable' });
    }
    res.status(200).json({ message: 'FAQ supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la FAQ' });
  }
};
