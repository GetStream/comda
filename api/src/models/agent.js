import mongoose, { Schema } from 'mongoose';
import findOneOrCreate from 'mongoose-findoneorcreate';
import query from 'mongoose-string-query';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import autopopulate from 'mongoose-autopopulate';
import 'mongoose-type-email';

mongoose.SchemaTypes.Email.defaults.message = 'Invalid email address.';

export const AgentSchema = new Schema(
	{
		name: {
			first: {
				type: String,
				trim: true,
				required: true,
			},
			last: {
				type: String,
				trim: true,
				required: true,
			},
		},
		email: {
			type: mongoose.SchemaTypes.Email,
			lowercase: true,
			trim: true,
			unique: true,
			required: true,
		},
		title: {
			type: String,
			trim: true,
			default: 'Support Agent',
		},
		image: {
			type: String,
			trim: true,
			default: '',
		},
		refs: {
			tags: {
				type: Schema.Types.ObjectId,
				ref: 'Tag',
				autopopulate: true,
			},
			organization: {
				type: Schema.Types.ObjectId,
				ref: 'Organization',
				required: true,
				autopopulate: {
					select: ['name', 'meta.logo'],
				},
			},
		},
		password: {
			type: String,
			required: true,
			bcrypt: true,
		},
		role: {
			type: String,
			enum: ['admin', 'moderator', 'viewer'],
			default: 'admin',
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		collection: 'agents',
	}
);

AgentSchema.plugin(findOneOrCreate);
AgentSchema.plugin(bcrypt);
AgentSchema.plugin(timestamps);
AgentSchema.plugin(query);
AgentSchema.plugin(autopopulate);

AgentSchema.index({ createdAt: 1, updatedAt: 1 });

module.exports = exports = mongoose.model('Agent', AgentSchema);
