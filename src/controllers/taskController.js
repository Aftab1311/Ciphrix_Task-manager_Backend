const Task = require('../models/Task');

exports.createTask = async (req,res) => {
  const { title, description, status } = req.body;
  const createdBy = req.user.id;
  try {
    const task = new Task({ title, description, status, createdBy });
    await task.save();
    res.json(task);
  } catch(e){ res.status(500).send('Server error'); }
};

exports.getTask = async (req,res) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email');
    if(!task) return res.status(404).json({msg:'Not found'});
    res.json(task);
  } catch(e){ res.status(500).send('Server error'); }
};

exports.updateTask = async (req,res) => {
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({msg:'Not found'});
    // optionally check owner or admin - here we allow editing by any authenticated user
    const updates = req.body;
    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch(e){ res.status(500).send('Server error'); }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    
    res.json({ msg: 'Task deleted successfully' });
    
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.listTasks = async (req,res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; 
    const q = status ? { status } : {};
    const total = await Task.countDocuments(q);
    const tasks = await Task.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name email');
    res.json({ tasks, total, page, totalPages: Math.ceil(total/limit) });
  } catch(e){ res.status(500).send('Server error'); }
};
