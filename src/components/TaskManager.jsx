import React from 'react';

class TaskManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: props.initialTasks || [],
            newTask: ''
        };
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        // Listen for external tasks from jQuery
        document.addEventListener('injectTask', (event) => {
            console.log('Received injectTask event:', event.detail); // Debug log
            if (event.detail && typeof event.detail === 'string') {
                const newTask = { text: event.detail, completed: false };
                this.setState(prev => ({
                    tasks: [...prev.tasks, newTask]
                }), () => this.emitTaskCountEvent());
            }
        });
    }

    componentWillUnmount() {
        // Cleanup event listener
        document.removeEventListener('injectTask', this.injectTaskHandler);
    }

    emitTaskCountEvent = () => {
        const { tasks } = this.state;
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        console.log('Emitting task count:', { total, completed, tasks }); // Debug log
        const event = new CustomEvent('taskCountUpdated', {
            detail: { total, completed }
        });
        
        // Use document instead of container ref
        document.dispatchEvent(event);
    };

    addTask = () => {
        const { newTask } = this.state;
        if (!newTask.trim()) {
            alert('Please enter a task');
            return;
        }

        const task = { text: newTask, completed: false };
        this.setState(prev => ({
            tasks: [...prev.tasks, task],
            newTask: ''
        }), () => this.emitTaskCountEvent());
    };

    toggleTask = (index) => {
        this.setState(prev => {
            const newTasks = [...prev.tasks];
            newTasks[index] = { ...newTasks[index], completed: !newTasks[index].completed };
            return { tasks: newTasks };
        }, () => this.emitTaskCountEvent());
    };

    deleteTask = (index) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            this.setState(prev => ({
                tasks: prev.tasks.filter((_, i) => i !== index)
            }), () => this.emitTaskCountEvent());
        }
    };

    handleInputChange = (e) => {
        this.setState({ newTask: e.target.value });
    };

    render() {
        const { tasks, newTask } = this.state;

        return React.createElement('div', { ref: this.containerRef, className: 'task-manager' },
            React.createElement('div', { className: 'task-header' },
                React.createElement('h2', null, 'Task Manager'),
                React.createElement('div', { className: 'task-stats' },
                    React.createElement('span', null, 'Total:', tasks.length),
                    React.createElement('span', null, 'Completed:', tasks.filter(task => task.completed).length)
                )
            ),
            React.createElement('div', { className: 'task-input' },
                React.createElement('input', {
                    type: 'text',
                    value: newTask,
                    onChange: this.handleInputChange,
                    placeholder: 'Add a new task...'
                }),
                React.createElement('button', { onClick: this.addTask }, 'Add Task')
            ),
            React.createElement('div', { className: 'task-list' },
                tasks.map((task, index) => 
                    React.createElement('div', { key: index, className: 'task-item' },
                        React.createElement('input', {
                            type: 'checkbox',
                            checked: task.completed,
                            onChange: () => this.toggleTask(index)
                        }),
                        React.createElement('span', { className: task.completed ? 'completed' : '' }, task.text),
                        React.createElement('button', { onClick: () => this.deleteTask(index) }, 'Delete')
                    )
                )
            )
        );
    }
}

export default TaskManager;
